// src/booking/booking.service.ts

import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Business } from '../business/business.entity';
import { Service } from '../service/service.entity';
import { User } from '../users/user.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class BookingService {
  private stripe: Stripe;


  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly paymentService: PaymentService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const stripeApiVersion = this.configService.get<string>('STRIPE_API_VERSION') || '2024-06-20';

    this.stripe = new Stripe(this.configService.get<string>('sk_test_51PWznJ2LWPbwsTpkdlGhUPG4wc5J1ZjvwD9nsejiObV6i0CusbF3hZ7lzfbjhUNIUfAl1vGc2eownLVrnG6uDoK300qtRpnWgo'), {
      apiVersion: stripeApiVersion as Stripe.StripeConfig['apiVersion'],
    });
  }

  private parseTime(time: string): string {
    if (!time) {
      throw new BadRequestException('Time string is undefined or empty');
    }
  
    // Replace dot separator with colon
    time = time.replace('.', ':').replace(' ', '').toLowerCase();
  
    const twelveHourMatch = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
    const twentyFourHourMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  
    let hour: number;
    let minute: number;
  
    if (twelveHourMatch) {
      let [_, hourStr, minuteStr, period] = twelveHourMatch;
      hour = parseInt(hourStr, 10);
      minute = parseInt(minuteStr, 10);
  
      if (period === 'pm' && hour !== 12) {
        hour += 12;
      } else if (period === 'am' && hour === 12) {
        hour = 0;
      }
    } else if (twentyFourHourMatch) {
      let [_, hourStr, minuteStr] = twentyFourHourMatch;
      hour = parseInt(hourStr, 10);
      minute = parseInt(minuteStr, 10);
    } else {
      throw new BadRequestException(`Invalid time format: ${time}`);
    }
  
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const business = await this.businessRepository.findOne({ where: { id: createBookingDto.businessId } });
    const service = await this.serviceRepository.findOne({ where: { id: createBookingDto.serviceId } });
    const customer = await this.userRepository.findOne({ where: { id: createBookingDto.customerId } });

    if (!business || !service || !customer) {
      throw new NotFoundException('Business, Service, or Customer not found');
    }

    const bookingDate = new Date(createBookingDto.date);
    const currentDate = new Date();
    if (bookingDate < currentDate) {
      throw new BadRequestException('Booking date must be in the future');
    }

    const dayOfWeek = bookingDate.toLocaleString('en-US', { weekday: 'long' });
    const businessHours = business.businessHours[dayOfWeek];

    if (!businessHours) {
      throw new BadRequestException(`Business is closed on ${dayOfWeek}`);
    }

    console.log(`Parsing business hours for ${dayOfWeek}: ${JSON.stringify(businessHours)}`);
    const openTime = this.parseTime(businessHours.open);
    const closeTime = this.parseTime(businessHours.close);

    if (openTime === 'closed' || closeTime === 'closed') {
      throw new BadRequestException(`Business is closed on ${dayOfWeek}`);
    }

    console.log(`Parsing booking times: start ${createBookingDto.startTime}, end ${createBookingDto.endTime}`);
    const startTime = this.parseTime(createBookingDto.startTime);
    const endTime = this.parseTime(createBookingDto.endTime);

    if (startTime < openTime || endTime > closeTime) {
      throw new BadRequestException('Booking time is outside of business hours');
    }

    const overlappingBooking = await this.bookingRepository.findOne({
      where: {
        business: { id: createBookingDto.businessId },
        service: { id: createBookingDto.serviceId },
        date: createBookingDto.date,
        startTime: Between(startTime, endTime),
        endTime: Between(startTime, endTime),
      },
    });

    if (overlappingBooking) {
      throw new BadRequestException('There is already a booking during this time slot');
    }

    const booking = new Booking();
    booking.business = business;
    booking.service = service;
    booking.customer = customer;
    booking.date = createBookingDto.date;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.status = 'confirmed';
    booking.paymentStatus = 'pending';

    return this.bookingRepository.save(booking);
  }
  async addPayment(bookingId: number, paymentMethodId: string): Promise<Booking> {
    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    booking.paymentStatus = 'paid';
    booking.paymentIntentId = paymentMethodId;
    return await this.bookingRepository.save(booking);
  }

  async confirmPayment(bookingId: number, paymentMethodId: string): Promise<Booking> {
    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
  
    const paymentIntent = await this.stripe.paymentIntents.confirm(
      booking.paymentIntentId,
      { payment_method: paymentMethodId }
    );
  
    if (paymentIntent.status === 'succeeded') {
      booking.paymentStatus = 'paid';
      return await this.bookingRepository.save(booking);
    } else {
      throw new BadRequestException('Payment confirmation failed');
    }
  }
  
  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOneBy({ id });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (updateBookingDto.date) {
      booking.date = updateBookingDto.date;
    }
    if (updateBookingDto.startTime) {
      booking.startTime = updateBookingDto.startTime;
    }
    if (updateBookingDto.endTime) {
      booking.endTime = updateBookingDto.endTime;
    }
    if (updateBookingDto.status) {
      booking.status = updateBookingDto.status;
    }

    if (updateBookingDto.paymentStatus) {
      booking.paymentStatus = updateBookingDto.paymentStatus;
    }

    if (updateBookingDto.refundStatus) {
      booking.refundStatus = updateBookingDto.refundStatus;
    }

    return this.bookingRepository.save(booking);
  }

  async findById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['business', 'service', 'customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }


    console.log('Fetched booking:', booking);
    console.log('Service price:', booking.service.price);

    return booking;
  }
  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findByBusiness(businessId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { business: { id: businessId } },
      relations: ['service'] 
    });
  }

  async findByCustomer(customerId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { customer: { id: customerId } },
      relations: ['business', 'service']
    });
  }

  async findPastBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        customer: { id: customerId },
        date: LessThan(new Date()),
      },
      relations: ['business', 'service']
    });
  }

  async findFutureBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        customer: { id: customerId },
        date: MoreThan(new Date()),
      },
      relations: ['business', 'service']
    });
  }

  async cancelBooking(id: number): Promise<void> {
    try {
        console.log(`Attempting to cancel booking with id: ${id}`); 

        // Find the booking by ID
        const booking = await this.bookingRepository.findOneBy({ id });

        if (!booking) {
            console.error(`Booking with id ${id} not found`); 
            throw new NotFoundException('Booking not found');
        }

        // Update booking status and save
        booking.status = 'Cancelled';
        booking.refundStatus = 'refunded'; 

        await this.bookingRepository.save(booking);
        console.log(`Booking with id ${id} successfully canceled.`); 

    } catch (error) {
        console.error(`Error cancelling booking with id ${id}: ${error.message}`); 
        throw new InternalServerErrorException('Error cancelling booking');
    }
  }
  async createPaymentIntent(bookingId: number, amount: number): Promise<Booking> {
    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
  
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { bookingId: booking.id.toString() },
    });
  
    booking.paymentIntentId = paymentIntent.id;
    return await this.bookingRepository.save(booking);
  }
  async getBookingsForOwner(ownerId: number): Promise<Booking[]> {
    // Fetch all bookings related to the businesses owned by the owner
    const bookings = await this.bookingRepository.find({
      where: {
        business: {
          owner: { id: ownerId }
        }
      },
      relations: ['business', 'customer', 'service'] 
    });
  
    if (!bookings) {
      throw new NotFoundException(`No bookings found for owner with ID ${ownerId}`);
    }
  
    return bookings;
  }
  
}
  

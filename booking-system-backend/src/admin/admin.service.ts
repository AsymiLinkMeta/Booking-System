import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../business/business.entity';
import { User } from '../users/user.entity';
import { Booking } from '../booking/booking.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findAllBusinesses() {
    try {
      return await this.businessRepository.find({ relations: ['owner'] });
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new InternalServerErrorException('Failed to fetch businesses');
    }
  }

  async findBusinessById(id: number) {
    try {
      const business = await this.businessRepository.findOne({ where: { id }, relations: ['owner'] });
      if (!business) {
        throw new NotFoundException(`Business with id ${id} not found`);
      }
      return business;
    } catch (error) {
      console.error(`Error fetching business with id ${id}:`, error);
      throw new InternalServerErrorException(`Failed to fetch business with id ${id}`);
    }
  }

  async findAllUsers() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findAllBookings() {
    try {
      return await this.bookingRepository.find({ relations: ['customer', 'business'] });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new InternalServerErrorException('Failed to fetch bookings');
    }
  }

  async generateReport() {
    try {
      const businessesCount = await this.businessRepository.count();
      const usersCount = await this.userRepository.count();
      const bookingsCount = await this.bookingRepository.count();
      return {
        businesses: businessesCount,
        users: usersCount,
        bookings: bookingsCount,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw new InternalServerErrorException('Failed to generate report');
    }
  }
}

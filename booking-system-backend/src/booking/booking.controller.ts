// src/booking/booking.controller.ts
import { Controller, Post, Body, Get, Param, Query, Put, Delete, Req, UseGuards, BadRequestException} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    try {
      return await this.bookingService.create(createBookingDto);
    } catch (error) {
      console.error('Error creating booking:', error.message);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    try {
      return await this.bookingService.update(+id, updateBookingDto);
    } catch (error) {
      console.error('Error updating booking:', error.message);
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookingService.findById(+id);
  }
  @Get()
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get('/business/:businessId')
  async findByBusiness(@Param('businessId') businessId: string) {
    return this.bookingService.findByBusiness(+businessId);
  }

  @Get('/customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: string) {
    const bookings = await this.bookingService.findByCustomer(+customerId);
    console.log('Bookings:', bookings); 
    return bookings;
  }

  @Get('/customer/:customerId/past')
  async findPastBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.findPastBookingsByCustomer(+customerId);
  }

  @Get('/customer/:customerId/future')
  async findFutureBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.findFutureBookingsByCustomer(+customerId);
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async cancelBooking(@Param('id') id: number, @Req() req: Request): Promise<void> {
    return this.bookingService.cancelBooking(id);
  }
  
  @Post(':id/confirm')
  async confirmPayment(@Param('id') bookingId: number, @Body() confirmPaymentDto: any) {
    const { paymentIntentId } = confirmPaymentDto;
    return this.bookingService.addPayment(bookingId, paymentIntentId);
  }
  
  @Get('business-owner/:ownerId')
  async getBookingsForOwner(@Param('ownerId') ownerId: number) {
    return this.bookingService.getBookingsForOwner(ownerId);
  }
}  
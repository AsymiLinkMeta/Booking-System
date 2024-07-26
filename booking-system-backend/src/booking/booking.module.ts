// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
import { Booking } from './booking.entity';
import { Business } from '../business/business.entity';
import { Service } from '../service/service.entity';
import { User } from '../users/user.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PaymentService } from '../payment/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Business, Service, User]),
    ConfigModule, 
  ],
  providers: [BookingService, PaymentService],
  controllers: [BookingController],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}

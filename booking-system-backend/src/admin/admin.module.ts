// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Booking } from '../booking/booking.entity';
import { Business } from '../business/business.entity';
import { BookingModule } from '../booking/booking.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking, Business]),
    BookingModule, 
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

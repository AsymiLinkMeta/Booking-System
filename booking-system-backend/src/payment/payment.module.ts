// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [ConfigModule, BookingModule], 
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

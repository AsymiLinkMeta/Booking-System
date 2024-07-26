// src/business/business.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from './business.entity';
import { Service } from '../service/service.entity'; 
import { UsersModule } from '../users/users.module'; 
import { Booking } from '../booking/booking.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Service]),
    UsersModule, 
  ],
  providers: [BusinessService],
  controllers: [BusinessController],
  exports: [BusinessService],
})
export class BusinessModule {}

// src/review/review.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Business } from '../business/business.entity';
import { User } from '../users/user.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Service } from '../service/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Business, User, Service])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}

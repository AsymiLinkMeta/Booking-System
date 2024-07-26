// src/review/review.service.ts
import { Injectable, NotFoundException,  ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Business } from '../business/business.entity';
import { User } from '../users/user.entity';
import { Service } from '../service/service.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const business = await this.businessRepository.findOneBy({ id: createReviewDto.businessId });
    const user = await this.userRepository.findOneBy({ id: createReviewDto.userId });
    const service = await this.serviceRepository.findOneBy({ id: createReviewDto.serviceId });

    if (!business || !user || !service) {
      throw new NotFoundException('Business, User, or Service not found');
    }

    const review = new Review();
    review.rating = createReviewDto.rating;
    review.reviewText = createReviewDto.reviewText;
    review.business = business;
    review.user = user;
    review.service = service;

    return this.reviewRepository.save(review);
  }

  async updateReview(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (updateReviewDto.ownerReply !== undefined) {
      review.ownerReply = updateReviewDto.ownerReply;
    }
    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }
    if (updateReviewDto.reviewText !== undefined) {
      review.reviewText = updateReviewDto.reviewText;
    }
    return this.reviewRepository.save(review);
  }

  async findByOwner(ownerId: number): Promise<Review[]> {
    const businesses = await this.businessRepository.find({ where: { ownerId } });
    console.log('Businesses:', businesses); 
    const businessIds = businesses.map(business => business.id);
    console.log('Business IDs:', businessIds); 

    const reviews = await this.reviewRepository.find({
      where: { business: { id: In(businessIds) } },
      relations: ['business', 'user', 'service'],
    });

    console.log('Reviews:', reviews); 
    return reviews;
  }
  async findByService(serviceId: number): Promise<Review[]> {
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
  
    const reviews = await this.reviewRepository.find({
      where: { service: { id: serviceId } },
      relations: ['business', 'user', 'service'],
    });
  
    return reviews;
  }
  
  
  
}

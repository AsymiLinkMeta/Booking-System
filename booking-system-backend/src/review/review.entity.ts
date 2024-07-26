// src/review/review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Business } from '../business/business.entity';
import { User } from '../users/user.entity';
import { Service } from '../service/service.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  rating: number;

  @Column('text')
  reviewText: string;

  @Column('text', { nullable: true })
  ownerReply: string;

  @ManyToOne(() => Business, business => business.reviews)
  business: Business;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Service, service => service.reviews, { onDelete: 'CASCADE' })
  service: Service;
}

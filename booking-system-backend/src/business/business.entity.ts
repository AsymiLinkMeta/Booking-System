// src/business/business.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Service } from '../service/service.entity';
import { Booking } from '../booking/booking.entity';
import { Review } from '../review/review.entity';
import { BusinessHours } from './business-hours.type';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('json')
  businessHours: BusinessHours;

  @Column()
  pricing: string;

  @Column()
  category: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column()
  cancellationPolicy: string;

  @Column()
  reschedulingPolicy: string;

  @Column('int')
  bookingLeadTime: number;

  @Column('int')
  maxBookingDuration: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, user => user.businesses)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Service, service => service.business, { cascade: true })
  servicesOffered: Service[];

  @OneToMany(() => Booking, booking => booking.business)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.business)
  reviews: Review[];
}

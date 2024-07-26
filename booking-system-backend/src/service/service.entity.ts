// src/service/service.entity.ts
import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Business } from '../business/business.entity';
import { Booking } from '../booking/booking.entity';
import { Review } from '../review/review.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  description: string;

  @Column('int')
  duration: number;

  @Column('decimal')
  price: number;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Business, business => business.servicesOffered, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @OneToMany(() => Booking, booking => booking.service)
  bookings: Booking[];
  
  @OneToMany(() => Review, review => review.service, { cascade: true })
  reviews: Review[];
}

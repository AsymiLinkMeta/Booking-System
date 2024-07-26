// src/booking/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Business } from '../business/business.entity';
import { Service } from '../service/service.entity';
import { User } from '../users/user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  startTime: string; // Store time in HH:MM format

  @Column()
  endTime: string; // Store time in HH:MM format

  @ManyToOne(() => Business, business => business.bookings)
  business: Business;

  @ManyToOne(() => Service, service => service.bookings)
  service: Service;

  @ManyToOne(() => User, user => user.bookings)
  customer: User;

  @Column()
  status: string; // e.g., 'confirmed', 'canceled'

  @Column({ default: 'pending' })
  paymentStatus: string; // e.g., 'pending', 'paid', 'failed'

  @Column({ default: '' })
  refundStatus: string; 

  @Column({ nullable: true })
  paymentIntentId: string;
}

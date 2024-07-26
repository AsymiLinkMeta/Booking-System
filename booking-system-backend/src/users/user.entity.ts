import { Entity, PrimaryGeneratedColumn, Column,  OneToMany } from 'typeorm';
import { Business } from '../business/business.entity'; 
import { Booking } from '../booking/booking.entity';
import { Review } from '../review/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin', 'business-owner', 'customer'

@OneToMany(() => Business, business => business.owner)
  businesses: Business[]; 

  @OneToMany(() => Booking, booking => booking.customer)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}

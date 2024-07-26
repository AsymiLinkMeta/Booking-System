// src/business/dto/business-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { Business } from '../business.entity';
import { ServiceDto } from './service.dto';
import { BusinessHours } from '../business-hours.type'; 
@Exclude()
export class BusinessResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  pricing: string;

  @Expose()
  category: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  website: string;

  @Expose()
  cancellationPolicy: string;

  @Expose()
  reschedulingPolicy: string;

  @Expose()
  bookingLeadTime: number;

  @Expose()
  maxBookingDuration: number;

  @Expose()
  businessHours: BusinessHours; 

  @Expose()
  @Type(() => ServiceDto)
  servicesOffered: ServiceDto[];

  @Expose()
  ownerId: number | null; 

  constructor(partial: Partial<Business>) {
    Object.assign(this, partial);
    this.ownerId = partial?.owner?.id || null; 
  }
}

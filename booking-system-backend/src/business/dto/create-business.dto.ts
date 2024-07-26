// src/business/dto/create-business.dto.ts
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceDto } from './service.dto';
import { BusinessHours } from '../business-hours.type'; 

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  servicesOffered: ServiceDto[];

  @IsString()
  pricing: string;
  
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @IsString()
  category: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  website: string;

  @IsString()
  cancellationPolicy: string;

  @IsString()
  reschedulingPolicy: string;

  @IsNumber()
  bookingLeadTime: number;

  @IsNumber()
  maxBookingDuration: number;

  @IsObject()
  @Type(() => Object) 
  businessHours: BusinessHours; 
}

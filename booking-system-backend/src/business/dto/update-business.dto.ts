// src/business/dto/update-business.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessHours } from '../business-hours.type'; // Import the type

class ServiceDto {
  @IsString()
  serviceName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  price: number;
}

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsObject()
  @Type(() => Object) 
  businessHours?: BusinessHours; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  @IsOptional()
  servicesOffered?: ServiceDto[];

  @IsString()
  @IsOptional()
  pricing?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @IsString()
  @IsOptional()
  reschedulingPolicy?: string;

  @IsNumber()
  @IsOptional()
  bookingLeadTime?: number;

  @IsNumber()
  @IsOptional()
  maxBookingDuration?: number;
}

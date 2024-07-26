// src/business/dto/service.dto.ts
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ServiceDto {
  @Expose()
  id: number;

  @Expose()
  serviceName: string;

  @Expose()
  description: string;

  @Expose()
  duration: number;

  @Expose()
  price: number;

  constructor(partial: Partial<ServiceDto>) {
    Object.assign(this, partial);
  }
}

// src/service/dto/service.dto.ts
export class ServiceDto {
    id: number;
    serviceName: string;
    description: string;
    duration: number;
    price: number;
    isDeleted?: boolean; 
  }
  
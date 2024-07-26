// src/booking/dto/create-booking.dto.ts
export class CreateBookingDto {
    date: Date;
    startTime: string;
    endTime: string;
    businessId: number;
    serviceId: number;
    customerId: number;
    paymentSource?: string;
  }
  
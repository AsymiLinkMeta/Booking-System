// src/payment/payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createPaymentDto: any) {
    return this.paymentService.createPaymentIntent(
      createPaymentDto.paymentMethodId,
      createPaymentDto.amount,
    );
  }
  
}

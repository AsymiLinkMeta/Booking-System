// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

async createPaymentIntent(paymentMethodId: string, amount: number): Promise<string> {
  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    payment_method: paymentMethodId,
    confirmation_method: 'manual',
    confirm: true,
    return_url: 'http://localhost:3000/payment-success',
  });

  if (paymentIntent.status === 'requires_action' && paymentIntent.next_action?.type === 'use_stripe_sdk') {
    throw new Error('Payment requires further action');
  }

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment failed');
  }

  return paymentIntent.id;
}

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return true;
    }

    return false;
  }

  async handlePaymentSuccess(bookingId: number, paymentIntentId: string): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (booking) {
        booking.paymentStatus = 'paid';
        await this.bookingRepository.save(booking);
        return 'Payment successful and booking updated';
      } else {
        return 'Booking not found';
      }
    } else {
      return 'Payment was not successful';
    }
  }
}
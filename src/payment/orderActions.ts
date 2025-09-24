'use server';

import { prisma as db } from '@/lib/prisma';

import Razorpay from 'razorpay';
import crypto from 'crypto';
import getCurrentUser from '@/lib/getcurrentuser';

const rzp = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: String(process.env.RAZORPAY_SECRET_ID!),
});

export async function createOrder(amount: number, items: { ebookId: string; price: number; quantity: number }[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const order = await rzp.orders.create({
    amount: amount * 100, 
    currency: 'INR', 
    receipt: `receipt_${Date.now()}`,
  });

  const dbOrder = await db.order.create({
    data: {
      userId: user.id,
      amount,
      totalAmount: amount, 
      taxAmount: 0,
      razorpayOrderId: order.id,
      orderItems: {
        create: items.map((item) => ({
          ebookId: item.ebookId,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  return { orderId: order.id, dbOrderId: dbOrder.id };
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  dbOrderId: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', String(process.env.RAZORPAY_SECRET_ID!))
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await db.order.update({
      where: { id: dbOrderId },
      data: { status: 'FAILED' },
    });
    throw new Error('Invalid signature');
  }

  const order = await db.order.update({
    where: { id: dbOrderId },
    data: {
      status: 'PAID',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
    include: { orderItems: true },
  });


  for (const item of order.orderItems) {
    await db.ownedEbook.upsert({
      where: {
        userId_ebookId: {
          userId: user.id,
          ebookId: item.ebookId,
        },
      },
      update: {
        quantity: { increment: item.quantity },
        available: { increment: item.quantity },
      },
      create: {
        userId: user.id,
        ebookId: item.ebookId,
        quantity: item.quantity,
        available: item.quantity,
      },
    });
  }

  return true;
}
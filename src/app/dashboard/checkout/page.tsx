
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadScript } from '@/lib/utils';
import { createOrder, verifyPayment } from '@/payment/orderActions';
import { useCartStore } from '@/stores/cart-store';
import { BanknoteArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) return alert('Razorpay SDK failed to load.');

    const { orderId, dbOrderId } = await createOrder(total, items.map(item => ({
      ebookId: item.id,
      price: item.discountedPrice,
      quantity: item.quantity,
    })));

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: 'INR',
      name: 'Delobooks',
      order_id: orderId,
      handler: async function (response: RazorpayResponse) {
        try {
          await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            dbOrderId
          );
          clearCart();
          router.push('/dashboard/my-library'); 
        } catch (error) {
          console.error(error);
        }
      },
    };

    const Razorpay = (window as unknown as { Razorpay: new (options: RazorpayOptions) => unknown }).Razorpay;
    const paymentObject = new Razorpay(options);
    (paymentObject as { open: () => void }).open();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className='min-w-sm ml-2 mr-2'>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.title} x {item.quantity}</span>
              <span>&#8377;{item.discountedPrice * item.quantity}</span>
            </div>
          ))}
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>&#8377;{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>&#8377;{tax}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>&#8377;{total}</span>
            </div>
          </div>
          <Button onClick={handlePay} className="mt-6 w-full"><BanknoteArrowUp />Pay Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
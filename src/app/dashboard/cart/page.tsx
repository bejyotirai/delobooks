"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PriceFormat from "@/components/ui/price-format";
import QuantityInput from "@/components/ui/quantity-input";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBasketIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-8">
      <Card className="min-w-sm ml-2 mr-2">
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4"
                  >

                    {item.coverImage ? (
                      <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-28 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}


                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">

                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          <PriceFormat
                            value={item.discountedPrice}
                            prefix="₹"
                          />
                          <b>× {item.quantity}</b>
                        </p>
                      </div>


                      <div className="flex items-center gap-2">
                        <QuantityInput
                          quantity={item.quantity}
                          min={1}
                          step={1}
                          onChange={(value) => updateQuantity(item.id, value)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>


              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-lg font-bold">
                  Total: <span className="ml-1">₹{total}</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={clearCart}><TrashIcon />Clear Cart</Button>
                  <Link href="/dashboard/checkout">
                    <Button><ShoppingBasketIcon />Proceed to Checkout</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

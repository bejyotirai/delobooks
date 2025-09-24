"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBasket } from "lucide-react";
 import { useRouter } from 'next/navigation';
import React from "react";

function CartButton() {
  const router = useRouter();
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  
  function onShop() {
    router.push("/dashboard/cart");
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <Button variant="outline" className="bg-muted/40 relative" size="icon" onClick={onShop}>
        <ShoppingBasket className="h-4 w-4" />
        {totalItems > 0 && (
          <Badge className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs transform translate-x-1/2 -translate-y-1/2">
            {totalItems}
          </Badge>
        )}
      </Button>
    </div>
  );
}

export default CartButton;

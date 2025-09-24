'use client';

import { Button } from '@/components/ui/button';
import QuantityInput from '@/components/ui/quantity-input';
import { Ebook } from '@/generated/prisma';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingBasketIcon, Trash2 } from 'lucide-react';


interface AddToCartButtonProps {
  ebook: Ebook;
}

export function AddToCartButton({ ebook }: AddToCartButtonProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const cartItem = items.find((item) => item.id === ebook.id);

  const handleAdd = () => {
    addItem({
      id: ebook.id,
      title: ebook.title,
      coverImage: ebook.coverImage,
      discountedPrice: ebook.discountedPrice,
      quantity: 1,
    });
  };

  return (
    <div className="w-full">
      {!cartItem ? (
        <Button onClick={handleAdd} className="w-full">
          <ShoppingBasketIcon className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <QuantityInput
            quantity={cartItem.quantity}
            min={1}
            onChange={(value) => updateQuantity(ebook.id, value)}
            className="flex-1"
          />
          <Button
            variant="destructive"
            onClick={() => removeItem(ebook.id)}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

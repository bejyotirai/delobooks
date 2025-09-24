"use client";

import ProductListCard from "@/components/admin/product/components/product-list-card";
import { Ebook } from "@/generated/prisma";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedProducts } from "@/stores/use-selected-products";
import { useState, useEffect } from "react";

interface Props {
  products: Ebook[];
}

export default function ProductListClient({ products }: Props) {
  const { selected, toggle } = useSelectedProducts();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <ScrollArea className="h-[600px] p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductListCard
            key={p.id}
            {...p}
            checked={selected.some((s) => s.id === p.id)}
            onCheckedChange={(checked) =>
              toggle(
                {
                  id: p.id,
                  coverImage: p.coverImage,
                  images: p.images,
                  url: p.url,
                },
                checked
              )
            }
          />
        ))}
      </div>
    </ScrollArea>
  );
}
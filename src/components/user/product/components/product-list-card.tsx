
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import Image from "next/image";
import { Ebook } from "@/generated/prisma";
import { AddToCartButton } from "./add-to-cart-button";
import PriceFormat_Sale from "@/components/ui/price-format-sale";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  ebook: Ebook;
}

export function ProductCard({ ebook }: ProductCardProps) {
  return (
    <Card className="w-full min-w-sm">
      <CardHeader>
        <div className="w-full">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 19} className="overflow-hidden rounded-lg">
              <Image
                src={ebook.coverImage}
                alt={ebook.title}
                fill
                priority
                className="object-cover transition-transform duration-300 hover:scale-105"
                unoptimized
              />
            </AspectRatio>
          </div>
        </div>
      </CardHeader>
      <CardContent className=" space-y-2">
        <CardTitle>{ebook.title}</CardTitle>
        <Badge>{ebook.author}</Badge>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {ebook.description}
        </CardDescription>
         <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs"
          >
            {ebook.category}
          </Badge>
          {ebook.format.map((fmt) => (
            <Badge
              key={fmt}
              variant="outline"
              className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 text-xs"
            >
              {fmt.toUpperCase()}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <PriceFormat_Sale
            originalPrice={ebook.originalPrice}
            salePrice={ebook.discountedPrice}
            prefix="₹"
            showSavePercentage={true}
            classNameSalePrice="text-lg sm:text-xl font-medium"
          />
        </div>
      </CardContent>
      <CardFooter>
        <AddToCartButton ebook={ebook} />
      </CardFooter>
    </Card>
  );
}

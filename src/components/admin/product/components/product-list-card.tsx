"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Ebook } from "@/generated/prisma";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Badge } from "@/components/ui/badge";
import PriceFormat_Sale from "@/components/ui/price-format-sale";

interface ProductListCardProps extends Ebook {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function ProductListCard({
  checked,
  onCheckedChange,
  format,
  category,
  ...props
}: ProductListCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    onCheckedChange(!checked);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/e-books/update/${props.slug}`);
  };

  return (
    <Card
      className="relative cursor-pointer rounded-2xl bg-background transition-all duration-200 hover:shadow-md has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
      onClick={handleCardClick}
      aria-checked={checked}
    >
      <CardHeader className="pt-4">
        <div className="absolute top-3 left-3">
          <Checkbox
            checked={checked}
            onCheckedChange={(c) => onCheckedChange(!!c)}
            aria-label={`Select ${props.title}`}
          />
        </div>
        <div className="w-full">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 19} className="overflow-hidden rounded-lg">
              <Image
                src={props.coverImage}
                alt={props.title}
                fill
                priority
                className="object-cover transition-transform duration-300 hover:scale-105"
                unoptimized
              />
            </AspectRatio>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight line-clamp-2">
          {props.title}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {props.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs"
          >
            {category}
          </Badge>
          {format.map((fmt) => (
            <Badge
              key={fmt}
              variant="outline"
              className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 text-xs"
            >
              {fmt.toUpperCase()}
            </Badge>
          ))}
        </div>
        <PriceFormat_Sale
          originalPrice={props.originalPrice}
          salePrice={props.discountedPrice}
          prefix="₹"
          showSavePercentage={true}
          classNameSalePrice="text-lg sm:text-xl font-medium"
        />
      </CardContent>
      <CardFooter className="p-4 sm:p-6">
        <Button
          className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleEditClick}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
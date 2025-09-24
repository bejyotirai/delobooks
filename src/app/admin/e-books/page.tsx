import { Ebook } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import ProductListWrapper from "@/components/admin/product/wrapper/product-list-wrapper";
import { Suspense } from "react";


export default async function Page() {
  const products: Ebook[] = await prisma.ebook.findMany();
  return (
    <div className="min-h-screen w-full bg-muted flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductListWrapper products={products} />
        </Suspense>
      </div>
    </div>
  );
}

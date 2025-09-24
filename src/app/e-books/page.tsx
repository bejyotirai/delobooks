import { Filter } from "@/components/user/product/components/filter";
import { PaginationControls } from "@/components/user/product/components/pagination-controls";
import { ProductCard } from "@/components/user/product/components/product-list-card";
import { SearchBar } from "@/components/user/product/components/search-bar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma";

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PAGE_SIZE = 10;

export default async function Page({ searchParams }: ProductsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const search = await searchParams;

  if (session) {
    redirect("/login");
  }
  
  const page = Number(search.page) || 1;
  const q = (search.q as string) || "";
  const category = (search.category as string) || "";

  const where: Prisma.EbookWhereInput = {
    ...(q
      ? { title: { contains: q, mode: Prisma.QueryMode.insensitive } }
      : {}),
    ...(category ? { category } : {}),
  };

  const [ebooks, total, categories] = await Promise.all([
    prisma.ebook.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.ebook.count({ where }),
    prisma.ebook
      .findMany({ select: { category: true }, distinct: ["category"] })
      .then((res) => res.map((r) => r.category)),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6 ml-2 mr-2 bg-background p-2 rounded-lg gap-1">
        <SearchBar />
        <Filter categories={categories} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
        {ebooks.map((ebook) => (
          <ProductCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationControls currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

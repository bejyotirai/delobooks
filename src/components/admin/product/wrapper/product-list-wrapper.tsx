"use client";

import ProductListClient from "@/components/admin/product/wrapper/product-list-client";
import { Ebook } from "@/generated/prisma";
import { useEffect } from "react";
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import ProductToolbar from "../toolbar/product-toolbar";
import ProductPagination from "../pagination/product-pagination";

const PAGE_SIZE = 8;

type SortType =
  | "book-title-asc"
  | "book-title-desc"
  | "book-price-asc"
  | "book-price-desc";

interface Props {
  products: Ebook[];
}

export default function ProductListWrapper({ products }: Props) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState<SortType>(
    "sort",
    parseAsStringEnum<SortType>([
      "book-title-asc",
      "book-title-desc",
      "book-price-asc",
      "book-price-desc",
    ]).withDefault("book-title-asc")
  );

  useEffect(() => {
    setPage(1);
  }, [search, sort, setPage]);

  const filtered = products
    .filter((p) => {
      const term = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term) ?? false)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "book-title-asc":
          return a.title.localeCompare(b.title);
        case "book-title-desc":
          return b.title.localeCompare(a.title);
        case "book-price-asc":
          return a.discountedPrice - b.discountedPrice;
        case "book-price-desc":
          return b.discountedPrice - a.discountedPrice;
      }
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageProducts = filtered.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="flex flex-col flex-1">
      <ProductToolbar
        currentPageProducts={currentPageProducts}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />
      <div className="p-6 border-2 border-dashed border-border rounded-lg bg-muted flex-1 m-2">
        <ProductListClient products={currentPageProducts} />
      </div>
      <ProductPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}
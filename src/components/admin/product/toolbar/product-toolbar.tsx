"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedProducts } from "@/stores/use-selected-products";
import { Ebook } from "@/generated/prisma";
import { useRouter } from "next/navigation";

import { PlusCircleIcon, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deleteSelected } from "../delete/action";

type SortType = "book-title-asc" | "book-title-desc" | "book-price-asc" | "book-price-desc";

interface Props {
  currentPageProducts: Ebook[];
  search: string;
  setSearch: (value: string | null) => Promise<URLSearchParams>;
  sort: SortType;
  setSort: (value: SortType | null) => Promise<URLSearchParams>;
}

export default function ProductToolbar({
  currentPageProducts,
  search,
  setSearch,
  sort,
  setSort,
}: Props) {
  const { selected, toggleAll, clear } = useSelectedProducts();
  const router = useRouter();
  const isAllSelected =
    currentPageProducts.length > 0 &&
    currentPageProducts.every((p) => selected.some((s) => s.id === p.id));

  const handleDelete = async (formData: FormData) => {
    await deleteSelected(formData);
    clear();
    router.refresh();
  };

  const selectAllDiv = (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={(v) =>
          toggleAll(
            currentPageProducts.map((p) => ({
              id: p.id,
              coverImage: p.coverImage,
              images: p.images,
              url: p.url,
            })),
            !!v
          )
        }
        aria-label="Select all products"
      />
      <span className="text-sm">Select All</span>
    </div>
  );

  const deleteForm = (
    <form action={handleDelete} className="relative">
      <input
        type="hidden"
        name="ids"
        value={selected.map((s) => s.id).join(",")}
      />
      <input
        type="hidden"
        name="coverImages"
        value={selected.map((s) => s.coverImage || "").join(",")}
      />
      <input
        type="hidden"
        name="urls"
        value={selected.map((s) => s.url || "").join(",")}
      />
      <input
        type="hidden"
        name="images"
        value={selected.flatMap((s) => s.images).join(",")}
      />
      <Button
        type="submit"
        variant="destructive"
        size="icon"
        className="relative"
      >
        <Trash className="h-4 w-4" />
        <Badge className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs transform translate-x-1/2 -translate-y-1/2">
          {selected.length}
        </Badge>
      </Button>
    </form>
  );

  return (
    <>
\
      <div className="sm:hidden flex flex-col gap-2 rounded-lg sticky top-0 z-10 p-2 border-b bg-background">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="book-title-asc">Title A-Z</SelectItem>
            <SelectItem value="book-title-desc">Title Z-A</SelectItem>
            <SelectItem value="book-price-asc">Price Low-High</SelectItem>
            <SelectItem value="book-price-desc">Price High-Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          {selected.length > 0 && selectAllDiv}
          <Button
            onClick={() => router.push("/admin/e-books/create")}
            className="flex-1"
            size="sm"
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
          {selected.length > 0 && deleteForm}
        </div>
      </div>


      <div className="hidden sm:flex items-center justify-between rounded-lg sticky top-0 z-10 p-2 border-b bg-background gap-4">
        <div className="flex items-center gap-4">
          {selected.length > 0 && selectAllDiv}
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book-title-asc">Title A-Z</SelectItem>
              <SelectItem value="book-title-desc">Title Z-A</SelectItem>
              <SelectItem value="book-price-asc">Price Low-High</SelectItem>
              <SelectItem value="book-price-desc">Price High-Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/admin/e-books/create")}>
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
          {selected.length > 0 && deleteForm}
        </div>
      </div>
    </>
  );
}
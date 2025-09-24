"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  totalPages: number;
  setPage: (value: number) => Promise<URLSearchParams>;
}

export default function ProductPagination({
  page,
  totalPages,
  setPage,
}: Props) {
  const handleClick = (p: number) => {
    setPage(p);
  };

  let items: (number | "ellipsis")[] = [];
  if (totalPages <= 5) {
    items = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    items.push(1);
    if (page > 3) items.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      items.push(i);
    }
    if (page < totalPages - 2) items.push("ellipsis");
    if (totalPages > 1) items.push(totalPages);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) handleClick(page - 1);
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item);
                }}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) handleClick(page + 1);
            }}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
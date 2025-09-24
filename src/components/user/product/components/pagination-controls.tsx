
'use client';


import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useQueryState } from 'nuqs';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}
export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const [ setPage] = useQueryState('page', { defaultValue: '1', parse: Number, serialize: String, shallow: false });

  return (
    <div className='bg-background rounded-lg p-1'>
       <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setPage((currentPage - 1).toString());
            }} 
          />
        </PaginationItem>
        <PaginationItem className='bg-muted rounded-lg'>
          <PaginationLink href="#">{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setPage((currentPage + 1).toString());
            }} 
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
   
  );
}
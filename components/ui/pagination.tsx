'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControl({ currentPage, totalPages, onPageChange }: Props) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between pt-4 gap-3">
      <Button
        variant="outline"
        className='disabled:cursor-not-allowed flex gap-1'
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        className='disabled:cursor-not-allowed flex gap-1'
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
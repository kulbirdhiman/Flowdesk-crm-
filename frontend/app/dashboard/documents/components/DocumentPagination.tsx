"use client";

import { Button } from "@/components/ui/button";

interface DocumentPaginationProps {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function DocumentPagination({
  totalCount,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange
}: DocumentPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t border-border bg-muted/20 px-4 flex-shrink-0">
      <div className="text-sm text-muted-foreground">
        {totalCount > 0 ? (
          <>
            Showing <span className="font-medium text-foreground">{pageIndex * pageSize + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> of{" "}
            <span className="font-medium text-foreground">{totalCount}</span> documents
          </>
        ) : (
          "No documents found"
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 w-20 rounded-md border border-input bg-background text-sm font-medium px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page <span className="font-medium text-foreground">{pageIndex + 1}</span> of <span className="font-medium text-foreground">{totalPages || 1}</span>
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => onPageChange(0)}
              className="hidden sm:inline-flex h-9"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
              className="h-9"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pageIndex + 1) * pageSize >= totalCount}
              onClick={() => onPageChange(pageIndex + 1)}
              className="h-9"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pageIndex + 1) * pageSize >= totalCount}
              onClick={() => onPageChange(totalPages - 1)}
              className="hidden sm:inline-flex h-9"
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

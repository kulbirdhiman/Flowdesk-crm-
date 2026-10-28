"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PaginationBar({
  total,
  currentPage,
  rowsPerPage,
  setRowsPerPage,
  first,
  prev,
  next,
  last,
}: {
  total: number;
  currentPage: number;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t border-border bg-muted/20 px-4 flex-shrink-0">
      <div className="text-sm text-muted-foreground">
        Showing {Math.min(1 + (currentPage - 1) * rowsPerPage, total)} to {Math.min(currentPage * rowsPerPage, total)} of {total} employees
      </div>
      <div className="flex items-center space-x-2">
        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={first} disabled={currentPage === 1}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={prev} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={next} disabled={currentPage === totalPages}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={last} disabled={currentPage === totalPages}>
            Last
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</div>
      </div>
    </div>
  );
}



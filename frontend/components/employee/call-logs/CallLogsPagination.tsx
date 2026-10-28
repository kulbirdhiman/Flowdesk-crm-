"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CallLogsPaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  rowsPerPage: number
  setRowsPerPage: (rows: number) => void
  startIndex: number
  endIndex: number
  totalCalls: number
}

export default function CallLogsPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  startIndex,
  endIndex,
  totalCalls
}: CallLogsPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-3 text-sm bg-background flex-shrink-0">
      <div className="text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, totalCalls)} of {totalCalls} calls
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="h-8 w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 px-3 text-sm"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-3 text-sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 px-3 text-sm"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 px-3 text-sm"
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

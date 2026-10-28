"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Eye, 
  Edit 
} from "lucide-react";

interface HRAttendanceTableViewProps {
  paginatedData: any[];
  visibleColumns: any;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => JSX.Element;
  handleViewRecord: (record: any) => void;
  handleEditRecord: (record: any) => void;
  getStatusBadge: (status: string) => JSX.Element;
  filteredData: any[];
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  currentPage: number;
  totalPages: number;
  handleFirstPage: () => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleLastPage: () => void;
}

export default function HRAttendanceTableView({
  paginatedData,
  visibleColumns,
  handleSort,
  getSortIcon,
  handleViewRecord,
  handleEditRecord,
  getStatusBadge,
  filteredData,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalPages,
  handleFirstPage,
  handlePrevPage,
  handleNextPage,
  handleLastPage
}: HRAttendanceTableViewProps) {
  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto border rounded-md bg-background">
        <div className="p-0 -mt-1">
          <Table className="rounded-none">
            <TableHeader className="rounded-none sticky top-0 bg-background z-10">
              <TableRow className="h-7">
                {visibleColumns.employee && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("employee_name")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Employee
                      {getSortIcon("employee_name")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.department && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("department")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Department
                      {getSortIcon("department")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.date && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date
                      {getSortIcon("date")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.status && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.timeIn && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("time_in")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Time In
                      {getSortIcon("time_in")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.timeOut && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("time_out")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Time Out
                      {getSortIcon("time_out")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.workingHours && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("working_hours")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Working Hours
                      {getSortIcon("working_hours")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.markedBy && (
                  <TableHead className="py-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("marked_by")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Marked By
                      {getSortIcon("marked_by")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.actions && <TableHead className="py-0 px-2">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-8">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">No Records Found</h3>
                      <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record) => (
                  <TableRow key={record.id} className="h-9">
                    {visibleColumns.employee && (
                      <TableCell className="py-2 px-3">
                        <div>
                          <div className="font-medium text-sm">{record.employee_name}</div>
                          <div className="text-sm text-gray-500">{record.employee_id}</div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.department && <TableCell className="py-2 px-3 text-sm">{record.department}</TableCell>}
                    {visibleColumns.date && <TableCell className="py-2 px-3 text-sm">{record.date}</TableCell>}
                    {visibleColumns.status && <TableCell className="py-2 px-3">{getStatusBadge(record.status)}</TableCell>}
                    {visibleColumns.timeIn && <TableCell className="py-2 px-3 text-sm">{record.time_in}</TableCell>}
                    {visibleColumns.timeOut && <TableCell className="py-2 px-3 text-sm">{record.time_out}</TableCell>}
                    {visibleColumns.workingHours && <TableCell className="py-2 px-3 text-sm">{record.working_hours}h</TableCell>}
                    {visibleColumns.markedBy && <TableCell className="py-2 px-3 text-sm">{record.marked_by}</TableCell>}
                    {visibleColumns.actions && (
                      <TableCell className="py-2 px-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="border-0 h-6 w-6 p-0"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="border-0 h-6 w-6 p-0"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-background -mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

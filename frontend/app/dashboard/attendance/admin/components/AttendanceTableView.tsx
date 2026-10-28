"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Eye, 
  Edit, 
  ArrowUp, 
  ArrowDown
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  employee_name: string;
  employee_id: string;
  job_title: string;
  date: string;
  status: string;
  time_in: string;
  time_out: string;
  working_hours: number;
  punctuality_status: string;
  marked_by: string;
  marked_at: string;
  notes: string;
}

interface AttendanceTableViewProps {
  paginatedData: AttendanceRecord[];
  visibleColumns: {
    employee: boolean;
    job_title: boolean;
    date: boolean;
    status: boolean;
    timeIn: boolean;
    timeOut: boolean;
    workingHours: boolean;
    markedBy: boolean;
    actions: boolean;
  };
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewRecord: (record: AttendanceRecord) => void;
  onEditRecord: (record: AttendanceRecord) => void;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  filteredDataLength: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export function AttendanceTableView({
  paginatedData,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onViewRecord,
  onEditRecord,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredDataLength,
  itemsPerPage,
  onItemsPerPageChange
}: AttendanceTableViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-100 text-green-800 rounded-full">Present</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-800 rounded-full">Absent</Badge>;
      case 'Half Day':
        return <Badge className="bg-yellow-100 text-yellow-800 rounded-full">Half Day</Badge>;
      case 'Holiday':
        return <Badge className="bg-purple-100 text-purple-800 rounded-full">Holiday</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 rounded-full">{status}</Badge>;
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto border rounded-md">
        <div className="p-0 -mt-1">
          <Table className="rounded-none">
            <TableHeader className="rounded-none sticky top-0 bg-background z-10">
              <TableRow className="h-3">
                {visibleColumns.employee && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("employee_name")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Employee
                      {getSortIcon("employee_name")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.job_title && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("job_title")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Job Title
                      {getSortIcon("job_title")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.date && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("date")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date
                      {getSortIcon("date")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.status && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("status")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.timeIn && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("time_in")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Time In
                      {getSortIcon("time_in")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.timeOut && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("time_out")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Time Out
                      {getSortIcon("time_out")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.workingHours && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("working_hours")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Working Hours
                      {getSortIcon("working_hours")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.markedBy && (
                  <TableHead className="py-0 px-2">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("marked_by")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Marked By
                      {getSortIcon("marked_by")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.actions && <TableHead className="py-1 px-2">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-8">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">No Records Found</h3>
                      <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record) => (
                  <TableRow key={record.id} className="h-3">
                    {visibleColumns.employee && (
                      <TableCell className="py-0 px-2">
                        <div>
                          <div className="font-medium text-base">{record.employee_name}</div>
                          <div className="text-base text-slate-500">{record.employee_id}</div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.job_title && <TableCell className="text-base">{record.job_title}</TableCell>}
                    {visibleColumns.date && <TableCell className="text-base">{record.date}</TableCell>}
                    {visibleColumns.status && <TableCell>{getStatusBadge(record.status)}</TableCell>}
                    {visibleColumns.timeIn && <TableCell className="text-base">{record.time_in}</TableCell>}
                    {visibleColumns.timeOut && <TableCell className="text-base">{record.time_out}</TableCell>}
                    {visibleColumns.workingHours && <TableCell className="text-base">{record.working_hours}h</TableCell>}
                    {visibleColumns.markedBy && <TableCell className="text-base">{record.marked_by}</TableCell>}
                    {visibleColumns.actions && (
                      <TableCell className="py-0 px-2">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="border-0"
                            onClick={() => onViewRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="border-0"
                            onClick={() => onEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
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

      {/* Pagination - Outside Table */}
      {filteredDataLength > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-background -mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredDataLength)} of {filteredDataLength} records
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
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
              onClick={onFirstPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
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
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLastPage}
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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CallLogsFilters from "./call-logs/CallLogsFilters";
import CallLogsTableView from "./call-logs/CallLogsTableView";
import { CallLog, SortColumn, SortDirection, ColumnVisibility } from "./call-logs/types";
import { 
  filterCalls, 
  sortCalls, 
  getSortIcon, 
  getCallTypeBadge, 
  getSentimentBadge, 
  getServiceColor, 
  formatDuration,
  exportToCSV
} from "./call-logs/utils";

interface CallLogsTableProps {
  calls: CallLog[];
}

export function CallLogsTable({ calls }: CallLogsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    mobile: true,
    service: true,
    duration: true,
    date: true,
    sentiment: true,
    type: true,
  });

  // Get unique services and sentiments for filter
  const services = Array.from(
    new Set(
      calls
        .map((call) => call.service || call.leads?.services)
        .filter(Boolean)
    )
  );

  const sentiments = Array.from(
    new Set(
      calls
        .map((call) => call.sentiment)
        .filter(Boolean)
    )
  );

  // Filter and sort calls
  const filteredCalls = filterCalls(calls, searchTerm, serviceFilter, sentimentFilter, dateFilter);
  const sortedCalls = sortCalls(filteredCalls, sortColumn, sortDirection);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, serviceFilter, dateFilter]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setServiceFilter([]);
    setSentimentFilter([]);
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (callId: string) => {
    router.push(`/employee/call-logs/${callId}`);
  };

  const handleExportToCSV = () => {
    exportToCSV(sortedCalls);
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      {/* Filters Bar */}
      <CallLogsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        sentimentFilter={sentimentFilter}
        setSentimentFilter={setSentimentFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        services={services}
        sentiments={sentiments}
        onClearAllFilters={clearAllFilters}
        onExportToCSV={handleExportToCSV}
      />

      {/* Table View */}
      {viewMode === "table" && (
        <CallLogsTableView
          calls={sortedCalls}
          columnVisibility={columnVisibility}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          onSort={handleSort}
          onRowClick={handleRowClick}
          getSortIcon={(column) => getSortIcon(column, sortColumn, sortDirection)}
          getCallTypeBadge={getCallTypeBadge}
          getSentimentBadge={getSentimentBadge}
          getServiceColor={getServiceColor}
          formatDuration={formatDuration}
        />
      )}

      {/* Kanban View - Placeholder for future implementation */}
      {viewMode === "kanban" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Kanban view coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
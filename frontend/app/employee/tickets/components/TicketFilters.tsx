"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Search,
  Filter,
  Calendar,
  X,
  Settings,
  Table,
  List,
  Grid3X3
} from "lucide-react";

interface TicketFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (filter: string[]) => void;
  timeFilter: string[];
  setTimeFilter: (filter: string[]) => void;
  viewMode: 'table' | 'list' | 'kanban';
  setViewMode: (mode: 'table' | 'list' | 'kanban') => void;
  visibleColumns: {
    ticket: boolean;
    company: boolean;
    client: boolean;
    status: boolean;
    priority: boolean;
    created: boolean;
    actions: boolean;
  };
  setVisibleColumns: (columns: any) => void;
  showColumnPopover: boolean;
  setShowColumnPopover: (show: boolean) => void;
  clearAllFilters: () => void;
  toggleColumn: (column: string) => void;
  resetColumns: () => void;
  onCreateTicket: () => void;
}

export default function TicketFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  timeFilter,
  setTimeFilter,
  viewMode,
  setViewMode,
  visibleColumns,
  setVisibleColumns,
  showColumnPopover,
  setShowColumnPopover,
  clearAllFilters,
  toggleColumn,
  resetColumns,
  onCreateTicket
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-3 flex-shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[300px] h-10"
        />

        <div className="flex gap-2 items-center">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] h-10 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter.length === 0 ? "All Status" : `${statusFilter.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter by Status</span>
                  {statusFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusFilter([])}
                      className="h-6 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => setStatusFilter([])}>
                    <input
                      type="checkbox"
                      checked={statusFilter.length === 0}
                      onChange={() => setStatusFilter([])}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">All Status</span>
                  </div>
                  {[
                    { value: "New", label: "New" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Escalated", label: "Escalated" },
                    { value: "Resolved", label: "Resolved" }
                  ].map((status) => (
                    <div key={status.value} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                         onClick={() => {
                           if (statusFilter.includes(status.value)) {
                             setStatusFilter(statusFilter.filter(s => s !== status.value));
                           } else {
                             setStatusFilter([...statusFilter, status.value]);
                           }
                         }}>
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(status.value)}
                        onChange={() => {
                          if (statusFilter.includes(status.value)) {
                            setStatusFilter(statusFilter.filter(s => s !== status.value));
                          } else {
                            setStatusFilter([...statusFilter, status.value]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{status.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Priority Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] h-10 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
                <Filter className="mr-2 h-4 w-4" />
                {priorityFilter.length === 0 ? "All Priority" : `${priorityFilter.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter by Priority</span>
                  {priorityFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPriorityFilter([])}
                      className="h-6 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => setPriorityFilter([])}>
                    <input
                      type="checkbox"
                      checked={priorityFilter.length === 0}
                      onChange={() => setPriorityFilter([])}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">All Priority</span>
                  </div>
                  {[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                    { value: "Critical", label: "Critical" }
                  ].map((priority) => (
                    <div key={priority.value} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                         onClick={() => {
                           if (priorityFilter.includes(priority.value)) {
                             setPriorityFilter(priorityFilter.filter(p => p !== priority.value));
                           } else {
                             setPriorityFilter([...priorityFilter, priority.value]);
                           }
                         }}>
                      <input
                        type="checkbox"
                        checked={priorityFilter.includes(priority.value)}
                        onChange={() => {
                          if (priorityFilter.includes(priority.value)) {
                            setPriorityFilter(priorityFilter.filter(p => p !== priority.value));
                          } else {
                            setPriorityFilter([...priorityFilter, priority.value]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{priority.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Time Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] h-10 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {timeFilter.length === 0 ? "All Time" : `${timeFilter.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter by Time</span>
                  {timeFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTimeFilter([])}
                      className="h-6 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => setTimeFilter([])}>
                    <input
                      type="checkbox"
                      checked={timeFilter.length === 0}
                      onChange={() => setTimeFilter([])}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">All Time</span>
                  </div>
                  {[
                    { value: "yesterday", label: "Yesterday" },
                    { value: "7days", label: "Last 7 Days" },
                    { value: "2weeks", label: "Last 2 Weeks" },
                    { value: "thismonth", label: "This Month" }
                  ].map((time) => (
                    <div key={time.value} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                         onClick={() => {
                           if (timeFilter.includes(time.value)) {
                             setTimeFilter(timeFilter.filter(t => t !== time.value));
                           } else {
                             setTimeFilter([...timeFilter, time.value]);
                           }
                         }}>
                      <input
                        type="checkbox"
                        checked={timeFilter.includes(time.value)}
                        onChange={() => {
                          if (timeFilter.includes(time.value)) {
                            setTimeFilter(timeFilter.filter(t => t !== time.value));
                          } else {
                            setTimeFilter([...timeFilter, time.value]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{time.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear All Filters Button */}
          {(searchTerm || statusFilter.length > 0 || priorityFilter.length > 0 || timeFilter.length > 0) && (
            <Button 
              variant="outline" 
              className="gap-2 h-10 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 bg-background border-muted-foreground/30"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}

          <Button onClick={onCreateTicket} className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Raise New Ticket
          </Button>

          {/* Custom Columns */}
          <Popover open={showColumnPopover} onOpenChange={setShowColumnPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                <Settings className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ticket"
                      checked={visibleColumns.ticket}
                      onCheckedChange={() => toggleColumn("ticket")}
                    />
                    <label htmlFor="ticket" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Ticket
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="company"
                      checked={visibleColumns.company}
                      onCheckedChange={() => toggleColumn("company")}
                    />
                    <label htmlFor="company" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Company
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="client"
                      checked={visibleColumns.client}
                      onCheckedChange={() => toggleColumn("client")}
                    />
                    <label htmlFor="client" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Client
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status"
                      checked={visibleColumns.status}
                      onCheckedChange={() => toggleColumn("status")}
                    />
                    <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Status
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="priority"
                      checked={visibleColumns.priority}
                      onCheckedChange={() => toggleColumn("priority")}
                    />
                    <label htmlFor="priority" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Priority
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="created"
                      checked={visibleColumns.created}
                      onCheckedChange={() => toggleColumn("created")}
                    />
                    <label htmlFor="created" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Created
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="actions"
                      checked={visibleColumns.actions}
                      onCheckedChange={() => toggleColumn("actions")}
                    />
                    <label htmlFor="actions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Actions
                    </label>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={resetColumns} className="w-full">
                  Reset All
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'table' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 w-8 p-0"
              title="Table View"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="h-8 w-8 p-0"
              title="Kanban View"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

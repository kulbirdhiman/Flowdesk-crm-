"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Target, 
  CalendarIcon, 
  Download, 
  LayoutGrid, 
  Table2,
  Plus
} from "lucide-react";

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (filter: string[]) => void;
  dateFilter: string[];
  setDateFilter: (filter: string[]) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  handleExport: () => void;
  clearAllFilters: () => void;
  handleCreateTask: () => void;
}

export default function TaskFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode,
  handleExport,
  clearAllFilters,
  handleCreateTask
}: TaskFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-0">
      {/* Left Side - Search Bar */}
      <div className="flex-1 max-w-none">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search using Name or Phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-muted-foreground/30 focus:border-primary text-foreground"
          />
        </div>
      </div>
      
      {/* Right Side - Filters, Buttons, and View Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter - Multi-selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] h-9 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
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
                {["pending", "in_progress", "completed", "cancelled"].map((status) => (
                  <div key={status} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => {
                         if (statusFilter.includes(status)) {
                           setStatusFilter(statusFilter.filter(s => s !== status));
                         } else {
                           setStatusFilter([...statusFilter, status]);
                         }
                       }}>
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => {
                        if (statusFilter.includes(status)) {
                          setStatusFilter(statusFilter.filter(s => s !== status));
                        } else {
                          setStatusFilter([...statusFilter, status]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Priority Filter - Multi-selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] h-9 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
              <Target className="mr-2 h-4 w-4" />
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
                {["high", "medium", "low"].map((priority) => (
                  <div key={priority} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => {
                         if (priorityFilter.includes(priority)) {
                           setPriorityFilter(priorityFilter.filter(p => p !== priority));
                         } else {
                           setPriorityFilter([...priorityFilter, priority]);
                         }
                       }}>
                    <input
                      type="checkbox"
                      checked={priorityFilter.includes(priority)}
                      onChange={() => {
                        if (priorityFilter.includes(priority)) {
                          setPriorityFilter(priorityFilter.filter(p => p !== priority));
                        } else {
                          setPriorityFilter([...priorityFilter, priority]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Date Filter - Multi-selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] h-9 justify-start text-left font-normal text-sm bg-background border-muted-foreground/30 text-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter.length === 0 ? "All Dates" : `${dateFilter.length} selected`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filter by Date</span>
                {dateFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateFilter([])}
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
                     onClick={() => setDateFilter([])}>
                  <input
                    type="checkbox"
                    checked={dateFilter.length === 0}
                    onChange={() => setDateFilter([])}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">All Dates</span>
                </div>
                {[
                  { value: "today", label: "Today" },
                  { value: "tomorrow", label: "Tomorrow" },
                  { value: "this_week", label: "This Week" },
                  { value: "overdue", label: "Overdue" }
                ].map((date) => (
                  <div key={date.value} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => {
                         if (dateFilter.includes(date.value)) {
                           setDateFilter(dateFilter.filter(d => d !== date.value));
                         } else {
                           setDateFilter([...dateFilter, date.value]);
                         }
                       }}>
                    <input
                      type="checkbox"
                      checked={dateFilter.includes(date.value)}
                      onChange={() => {
                        if (dateFilter.includes(date.value)) {
                          setDateFilter(dateFilter.filter(d => d !== date.value));
                        } else {
                          setDateFilter([...dateFilter, date.value]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{date.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Clear All Filters Button */}
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="h-9 px-3 text-sm bg-background border-muted-foreground/30 text-foreground hover:bg-muted/50"
        >
          Clear All
        </Button>
        
        {/* Export Button */}
        <Button
          variant="outline"
          onClick={handleExport}
          className="h-9 px-3 text-sm bg-background border-muted-foreground/30 text-foreground hover:bg-muted/50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        {/* View Toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("kanban")}
            className="rounded-r-none h-9 px-3"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="rounded-l-none h-9 px-3"
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Create Task Button */}
        <Button onClick={handleCreateTask} className="gap-2 h-9">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>
    </div>
  );
}

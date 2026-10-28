"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Settings, 
  Grid3X3, 
  Table, 
  CalendarDays 
} from "lucide-react";

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (priority: string[]) => void;
  timeFilter: string[];
  setTimeFilter: (time: string[]) => void;
  viewType: "kanban" | "table" | "calendar";
  setViewType: (view: "kanban" | "table" | "calendar") => void;
  visibleColumns: {
    task: boolean;
    assignee: boolean;
    status: boolean;
    priority: boolean;
    dueDate: boolean;
    actions: boolean;
  };
  setVisibleColumns: (columns: any) => void;
  onCreateTask: () => void;
}

export default function TaskFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  timeFilter,
  setTimeFilter,
  viewType,
  setViewType,
  visibleColumns,
  setVisibleColumns,
  onCreateTask
}: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create Task Button */}
      <Button onClick={onCreateTask} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Task
      </Button>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-between bg-background border-border hover:bg-muted/50">
            {statusFilter.length === 0 ? "All Status" : `${statusFilter.length} selected`}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Filter by Status</span>
          </div>
          <div className="py-2">
            {["pending", "in_progress", "completed", "cancelled"].map((status) => (
              <div key={status} className="px-4 py-2 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`status-${status}`}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, status]);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== status));
                      }
                    }}
                    className="border-border"
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm text-foreground cursor-pointer capitalize">
                    {status.replace('_', ' ')}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Priority Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-between bg-background border-border hover:bg-muted/50">
            {priorityFilter.length === 0 ? "All Priority" : `${priorityFilter.length} selected`}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Filter by Priority</span>
          </div>
          <div className="py-2">
            {["low", "medium", "high"].map((priority) => (
              <div key={priority} className="px-4 py-2 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, priority]);
                      } else {
                        setPriorityFilter(priorityFilter.filter(p => p !== priority));
                      }
                    }}
                    className="border-border"
                  />
                  <Label htmlFor={`priority-${priority}`} className="text-sm text-foreground cursor-pointer capitalize">
                    {priority}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Time Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-between bg-background border-border hover:bg-muted/50">
            {timeFilter.length === 0 ? "All Time" : `${timeFilter.length} selected`}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Filter by Time</span>
          </div>
          <div className="py-2">
            {["today", "week", "month", "overdue"].map((time) => (
              <div key={time} className="px-4 py-2 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`time-${time}`}
                    checked={timeFilter.includes(time)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTimeFilter([...timeFilter, time]);
                      } else {
                        setTimeFilter(timeFilter.filter(t => t !== time));
                      }
                    }}
                    className="border-border"
                  />
                  <Label htmlFor={`time-${time}`} className="text-sm text-foreground cursor-pointer capitalize">
                    {time === "week" ? "This Week" : time === "month" ? "This Month" : time}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Toggle */}
      <ToggleGroup
        type="single"
        value={viewType}
        onValueChange={(value) => setViewType(value as "kanban" | "table" | "calendar")}
        variant="outline"
        className="flex"
      >
        <ToggleGroupItem value="kanban" aria-label="Kanban view">
          <Grid3X3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table view">
          <Table className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="calendar" aria-label="Calendar view">
          <CalendarDays className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Customize Columns Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex items-center justify-between p-2">
            <span className="text-sm font-medium">Column Filter</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setVisibleColumns({
                  task: true,
                  assignee: true,
                  status: true,
                  priority: true,
                  dueDate: true,
                  actions: true,
                });
              }}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-1 p-2">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${key}`}
                  checked={value}
                  onCheckedChange={(checked) => {
                    setVisibleColumns((prev: any) => ({
                      ...prev,
                      [key]: checked
                    }));
                  }}
                />
                <Label htmlFor={`column-${key}`} className="text-sm capitalize">
                  {key === 'task' ? 'Task' :
                   key === 'assignee' ? 'Assignee' :
                   key === 'status' ? 'Status' :
                   key === 'priority' ? 'Priority' :
                   key === 'dueDate' ? 'Due Date' :
                   key === 'actions' ? 'Actions' : key}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

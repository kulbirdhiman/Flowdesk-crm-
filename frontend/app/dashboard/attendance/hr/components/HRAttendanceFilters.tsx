"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  ChevronDown, 
  Settings, 
  List, 
  Grid3X3 
} from "lucide-react";

interface HRAttendanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  departmentFilter: string[];
  setDepartmentFilter: (filter: string[]) => void;
  timeFilter: string[];
  setTimeFilter: (filter: string[]) => void;
  viewType: "table" | "kanban";
  setViewType: (type: "table" | "kanban") => void;
  visibleColumns: any;
  setVisibleColumns: (columns: any) => void;
  employees: any[];
}

export default function HRAttendanceFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  timeFilter,
  setTimeFilter,
  viewType,
  setViewType,
  visibleColumns,
  setVisibleColumns,
  employees
}: HRAttendanceFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap -mt-2">
      <Input
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 min-w-[300px] h-10"
      />
      
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
            <Filter className="h-4 w-4 mr-2" />
            {statusFilter.length > 0 ? `${statusFilter.length} Status` : "All Status"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Select Status
          </div>
          <div className="space-y-1">
            {["Present", "Absent", "Half Day", "Holiday"].map(status => (
              <div key={status} className="flex items-center space-x-2 px-2 py-1.5">
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
                />
                <Label htmlFor={`status-${status}`} className="text-sm">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Department Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
            <Filter className="h-4 w-4 mr-2" />
            {departmentFilter.length > 0 ? `${departmentFilter.length} Departments` : "All Departments"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Select Departments
          </div>
          <div className="space-y-1">
            {[...new Set(employees.map(emp => emp.department))].map(dept => (
              <div key={dept} className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={departmentFilter.includes(dept)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDepartmentFilter([...departmentFilter, dept]);
                    } else {
                      setDepartmentFilter(departmentFilter.filter(d => d !== dept));
                    }
                  }}
                />
                <Label htmlFor={`dept-${dept}`} className="text-sm">
                  {dept}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Time Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
            <Filter className="h-4 w-4 mr-2" />
            {timeFilter.length > 0 ? `${timeFilter.length} Time` : "All Time"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Select Time Period
          </div>
          <div className="space-y-1">
            {["Today", "Yesterday", "Last 7 Days"].map(time => (
              <div key={time} className="flex items-center space-x-2 px-2 py-1.5">
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
                />
                <Label htmlFor={`time-${time}`} className="text-sm">
                  {time}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Toggle */}
      <div className="flex border rounded-md">
        <Button
          variant={viewType === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("table")}
          className="rounded-r-none"
          title="Table View"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewType === "kanban" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("kanban")}
          className="rounded-l-none"
          title="Kanban View"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Customize Columns Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
            <Settings className="h-4 w-4 mr-2" />
            Customize Columns
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Toggle Columns
          </div>
          <div className="space-y-1">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id={`column-${key}`}
                  checked={value as boolean}
                  onCheckedChange={(checked) => {
                    setVisibleColumns({
                      ...visibleColumns,
                      [key]: checked
                    });
                  }}
                />
                <Label htmlFor={`column-${key}`} className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            ))}
          </div>
          <div className="px-2 py-1.5 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleColumns({
                employee: true,
                department: true,
                date: true,
                status: true,
                timeIn: true,
                timeOut: true,
                workingHours: true,
                markedBy: true,
                actions: true
              })}
              className="w-full justify-start"
            >
              Reset to Default
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

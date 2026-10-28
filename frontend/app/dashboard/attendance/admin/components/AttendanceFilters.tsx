"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Settings, 
  List, 
  Grid3X3, 
  TrendingUp
} from "lucide-react";

interface AttendanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  jobTitleFilter: string[];
  setJobTitleFilter: (filter: string[]) => void;
  timeFilter: string[];
  setTimeFilter: (filter: string[]) => void;
  viewType: "table" | "kanban" | "rankings";
  setViewType: (type: "table" | "kanban" | "rankings") => void;
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
  setVisibleColumns: (columns: any) => void;
  attendanceData: any[];
}

export function AttendanceFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  jobTitleFilter,
  setJobTitleFilter,
  timeFilter,
  setTimeFilter,
  viewType,
  setViewType,
  visibleColumns,
  setVisibleColumns,
  attendanceData
}: AttendanceFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap -mt-2">
      <Input
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 min-w-[300px] h-10"
      />

      <div className="flex gap-2 items-center">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 h-10 justify-between">
              {statusFilter.length === 0 ? "All Status" : 
               statusFilter.length === 1 ? statusFilter[0] : 
               `${statusFilter.length} Status`}
              <ChevronDown className="ml-2 h-4 w-4" />
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
                  <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Job Title Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 h-10 justify-between">
              {jobTitleFilter.length === 0 ? "All Job Titles" : 
               jobTitleFilter.length === 1 ? jobTitleFilter[0] : 
               `${jobTitleFilter.length} Job Titles`}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Select Job Title
            </div>
            <div className="space-y-1">
              {Array.from(new Set(attendanceData.map(record => record.job_title).filter(Boolean))).map(jobTitle => (
                <div key={jobTitle} className="flex items-center space-x-2 px-2 py-1.5">
                  <Checkbox
                    id={`job-${jobTitle}`}
                    checked={jobTitleFilter.includes(jobTitle)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setJobTitleFilter([...jobTitleFilter, jobTitle]);
                      } else {
                        setJobTitleFilter(jobTitleFilter.filter(j => j !== jobTitle));
                      }
                    }}
                  />
                  <Label htmlFor={`job-${jobTitle}`} className="text-sm cursor-pointer">
                    {jobTitle}
                  </Label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 h-10 justify-between">
              {timeFilter.length === 0 ? "All Time" : 
               timeFilter.length === 1 ? timeFilter[0] : 
               `${timeFilter.length} Time`}
              <ChevronDown className="ml-2 h-4 w-4" />
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
                  <Label htmlFor={`time-${time}`} className="text-sm cursor-pointer">
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
            className="rounded-none"
            title="Kanban View"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "rankings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewType("rankings")}
            className="rounded-l-none"
            title="Top Attendance Rankings"
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Customize Columns Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              <Settings className="h-4 w-4 mr-2" />
              Customize Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Show/Hide Columns
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-employee"
                  checked={visibleColumns.employee}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, employee: !!checked })
                  }
                />
                <Label htmlFor="dropdown-employee" className="text-sm cursor-pointer">Employee</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-job_title"
                  checked={visibleColumns.job_title}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, job_title: !!checked })
                  }
                />
                <Label htmlFor="dropdown-job_title" className="text-sm cursor-pointer">Job Title</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-date"
                  checked={visibleColumns.date}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, date: !!checked })
                  }
                />
                <Label htmlFor="dropdown-date" className="text-sm cursor-pointer">Date</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-status"
                  checked={visibleColumns.status}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, status: !!checked })
                  }
                />
                <Label htmlFor="dropdown-status" className="text-sm cursor-pointer">Status</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-timeIn"
                  checked={visibleColumns.timeIn}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, timeIn: !!checked })
                  }
                />
                <Label htmlFor="dropdown-timeIn" className="text-sm cursor-pointer">Time In</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-timeOut"
                  checked={visibleColumns.timeOut}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, timeOut: !!checked })
                  }
                />
                <Label htmlFor="dropdown-timeOut" className="text-sm cursor-pointer">Time Out</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-workingHours"
                  checked={visibleColumns.workingHours}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, workingHours: !!checked })
                  }
                />
                <Label htmlFor="dropdown-workingHours" className="text-sm cursor-pointer">Working Hours</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-markedBy"
                  checked={visibleColumns.markedBy}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, markedBy: !!checked })
                  }
                />
                <Label htmlFor="dropdown-markedBy" className="text-sm cursor-pointer">Marked By</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1.5">
                <Checkbox
                  id="dropdown-actions"
                  checked={visibleColumns.actions}
                  onCheckedChange={(checked) => 
                    setVisibleColumns({ ...visibleColumns, actions: !!checked })
                  }
                />
                <Label htmlFor="dropdown-actions" className="text-sm cursor-pointer">Actions</Label>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

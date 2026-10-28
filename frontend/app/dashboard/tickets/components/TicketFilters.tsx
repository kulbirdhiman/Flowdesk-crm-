"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  ChevronDown, 
  List, 
  Grid3X3, 
  Settings 
} from "lucide-react";

interface VisibleColumns {
  ticketNumber: boolean;
  company: boolean;
  client: boolean;
  issue: boolean;
  status: boolean;
  priority: boolean;
  assignedTo: boolean;
  created: boolean;
  actions: boolean;
}

interface TicketFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (priority: string[]) => void;
  timeFilter: string[];
  setTimeFilter: (time: string[]) => void;
  showKanban: boolean;
  setShowKanban: (show: boolean) => void;
  visibleColumns: VisibleColumns;
  setVisibleColumns: (columns: VisibleColumns) => void;
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
  showKanban,
  setShowKanban,
  visibleColumns,
  setVisibleColumns,
  onCreateTicket
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2 border-b">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[300px] h-10"
          />

          <div className="flex gap-2 items-center">
            <Button onClick={onCreateTicket} className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              Raise New Ticket
            </Button>

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
                  {["New", "In Progress", "Escalated", "Resolved"].map(status => (
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

            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 h-10 justify-between">
                  {priorityFilter.length === 0 ? "All Priority" : 
                   priorityFilter.length === 1 ? priorityFilter[0] : 
                   `${priorityFilter.length} Priority`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Select Priority
                </div>
                <div className="space-y-1">
                  {["Low", "Medium", "High", "Critical"].map(priority => (
                    <div key={priority} className="flex items-center space-x-2 px-2 py-1.5">
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
                      />
                      <Label htmlFor={`priority-${priority}`} className="text-sm cursor-pointer">
                        {priority}
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
                  Select Time Range
                </div>
                <div className="space-y-1">
                  {["Today", "This Week", "This Month"].map(time => (
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

            {/* View Toggle Buttons */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={!showKanban ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowKanban(false)}
                className="h-8 w-8 p-0"
                title="Table View"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={showKanban ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowKanban(true)}
                className="h-8 w-8 p-0"
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
                      id="dropdown-ticket-number"
                      checked={visibleColumns.ticketNumber}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, ticketNumber: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-ticket-number" className="text-sm cursor-pointer">Ticket #</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1.5">
                    <Checkbox
                      id="dropdown-company"
                      checked={visibleColumns.company}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, company: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-company" className="text-sm cursor-pointer">Company</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1.5">
                    <Checkbox
                      id="dropdown-client"
                      checked={visibleColumns.client}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, client: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-client" className="text-sm cursor-pointer">Client</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1.5">
                    <Checkbox
                      id="dropdown-issue"
                      checked={visibleColumns.issue}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, issue: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-issue" className="text-sm cursor-pointer">Issue</Label>
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
                      id="dropdown-priority"
                      checked={visibleColumns.priority}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, priority: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-priority" className="text-sm cursor-pointer">Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1.5">
                    <Checkbox
                      id="dropdown-assigned-to"
                      checked={visibleColumns.assignedTo}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, assignedTo: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-assigned-to" className="text-sm cursor-pointer">Assigned To</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1.5">
                    <Checkbox
                      id="dropdown-created"
                      checked={visibleColumns.created}
                      onCheckedChange={(checked) => 
                        setVisibleColumns({ ...visibleColumns, created: !!checked })
                      }
                    />
                    <Label htmlFor="dropdown-created" className="text-sm cursor-pointer">Created</Label>
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
      </div>
    </div>
  );
}

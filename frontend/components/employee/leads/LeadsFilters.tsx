"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Briefcase, 
  Calendar, 
  Download, 
  LayoutGrid, 
  Columns, 
  Kanban 
} from "lucide-react";
import { format } from "date-fns";

interface LeadsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  serviceFilter: string[];
  setServiceFilter: (services: string[]) => void;
  stageFilter: string;
  setStageFilter: (stage: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  viewMode: "table" | "kanban";
  setViewMode: (mode: "table" | "kanban") => void;
  columnVisibility: {
    date: boolean;
    name: boolean;
    mobile: boolean;
    email: boolean;
    service: boolean;
    city: boolean;
    source: boolean;
    stage: boolean;
    followup: boolean;
  };
  setColumnVisibility: (visibility: any) => void;
  services: (string | undefined)[];
  stages: (string | undefined)[];
  showFollowUpDate: boolean;
  onExport: () => void;
}

export default function LeadsFilters({
  searchTerm,
  setSearchTerm,
  serviceFilter,
  setServiceFilter,
  stageFilter,
  setStageFilter,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode,
  columnVisibility,
  setColumnVisibility,
  services,
  stages,
  showFollowUpDate,
  onExport
}: LeadsFiltersProps) {
  return (
    <div className="flex justify-between items-center gap-2 flex-wrap pb-2 flex-shrink-0 bg-background">
      {/* Left Side - Search */}
      <div className="w-full lg:flex-1 lg:max-w-xl">
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-9 text-base"
        />
      </div>

      {/* Right Side - Filters and Actions */}
      <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto">
        {/* Service Filter - Multi-selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] h-9 justify-start text-left font-normal text-sm">
              <Briefcase className="mr-2 h-4 w-4" />
              {serviceFilter.length === 0 ? "All Services" : `${serviceFilter.length} selected`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filter by Services</span>
                {serviceFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setServiceFilter([])}
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
                     onClick={() => setServiceFilter([])}>
                  <input
                    type="checkbox"
                    checked={serviceFilter.length === 0}
                    onChange={() => setServiceFilter([])}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">All Services</span>
                </div>
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => {
                         if (serviceFilter.includes(service!)) {
                           setServiceFilter(serviceFilter.filter(s => s !== service));
                         } else {
                           setServiceFilter([...serviceFilter, service!]);
                         }
                       }}>
                    <input
                      type="checkbox"
                      checked={serviceFilter.includes(service!)}
                      onChange={() => {
                        if (serviceFilter.includes(service!)) {
                          setServiceFilter(serviceFilter.filter(s => s !== service));
                        } else {
                          setServiceFilter([...serviceFilter, service!]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Stage Filter */}
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[100px] h-9 text-sm">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage!}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[120px] h-9 justify-start text-left font-normal text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              {dateFilter ? format(dateFilter, "MMM dd") : "All Dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex flex-col">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter by Date</span>
                  {dateFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateFilter(undefined)}
                      className="h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <CalendarComponent
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Kanban/Table View Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
            title={viewMode === "table" ? "Switch to Kanban View" : "Switch to Table View"}
            className="h-9 w-9 p-0"
          >
            {viewMode === "table" ? <Kanban className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="h-9 text-sm gap-1" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>

          {/* Customize Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 text-sm gap-1">
                <Columns className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility.date}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, date: value }))
                }
              >
                Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.name}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, name: value }))
                }
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.mobile}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, mobile: value }))
                }
              >
                Mobile
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.email}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, email: value }))
                }
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.service}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, service: value }))
                }
              >
                Service
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.city}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, city: value }))
                }
              >
                City
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.source}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, source: value }))
                }
              >
                Source
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.stage}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev: any) => ({ ...prev, stage: value }))
                }
              >
                Stage
              </DropdownMenuCheckboxItem>
              {showFollowUpDate && (
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.followup}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev: any) => ({ ...prev, followup: value }))
                  }
                >
                  Follow-up Date
                </DropdownMenuCheckboxItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

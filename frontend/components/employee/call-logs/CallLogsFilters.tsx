"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Download, Columns, LayoutGrid, Briefcase, Heart, X } from "lucide-react"
import { format } from "date-fns"

interface CallLogsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  serviceFilter: string[]
  setServiceFilter: (services: string[]) => void
  sentimentFilter: string[]
  setSentimentFilter: (sentiments: string[]) => void
  dateFilter: Date | undefined
  setDateFilter: (date: Date | undefined) => void
  viewMode: "table" | "kanban"
  setViewMode: (mode: "table" | "kanban") => void
  columnVisibility: {
    name: boolean
    mobile: boolean
    service: boolean
    duration: boolean
    date: boolean
    sentiment: boolean
    type: boolean
  }
  setColumnVisibility: (visibility: any) => void
  services: string[]
  sentiments: string[]
  onClearAllFilters: () => void
  onExportToCSV: () => void
}

export default function CallLogsFilters({
  searchTerm,
  setSearchTerm,
  serviceFilter,
  setServiceFilter,
  sentimentFilter,
  setSentimentFilter,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode,
  columnVisibility,
  setColumnVisibility,
  services,
  sentiments,
  onClearAllFilters,
  onExportToCSV
}: CallLogsFiltersProps) {
  const hasActiveFilters = searchTerm || serviceFilter.length > 0 || sentimentFilter.length > 0 || dateFilter

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between flex-shrink-0 pb-3 bg-background">
      {/* Left Side - Search */}
      <div className="w-full lg:flex-1 lg:max-w-2xl">
        <Input
          placeholder="Search using Name or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-9 text-base"
        />
      </div>

      {/* Right Side - Filters and Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
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

        {/* Sentiment Filter - Multi-selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] h-9 justify-start text-left font-normal text-sm">
              <Heart className="mr-2 h-4 w-4" />
              {sentimentFilter.length === 0 ? "All Sentiments" : `${sentimentFilter.length} selected`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filter by Sentiments</span>
                {sentimentFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSentimentFilter([])}
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
                     onClick={() => setSentimentFilter([])}>
                  <input
                    type="checkbox"
                    checked={sentimentFilter.length === 0}
                    onChange={() => setSentimentFilter([])}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">All Sentiments</span>
                </div>
                {sentiments.map((sentiment) => (
                  <div key={sentiment} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                       onClick={() => {
                         if (sentimentFilter.includes(sentiment!)) {
                           setSentimentFilter(sentimentFilter.filter(s => s !== sentiment));
                         } else {
                           setSentimentFilter([...sentimentFilter, sentiment!]);
                         }
                       }}>
                    <input
                      type="checkbox"
                      checked={sentimentFilter.includes(sentiment!)}
                      onChange={() => {
                        if (sentimentFilter.includes(sentiment!)) {
                          setSentimentFilter(sentimentFilter.filter(s => s !== sentiment));
                        } else {
                          setSentimentFilter([...sentimentFilter, sentiment!]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{sentiment}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 h-9 text-sm">
              <Calendar className="h-4 w-4" />
              {dateFilter ? format(dateFilter, "MMM dd, yyyy") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
            {dateFilter && (
              <div className="p-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDateFilter(undefined)}
                  className="w-full"
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            className="gap-2 h-9 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={onClearAllFilters}
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}

        {/* View Toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9"
          onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>

        {/* Export */}
        <Button 
          variant="outline" 
          className="gap-2 h-9 text-sm"
          onClick={onExportToCSV}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        {/* Customize Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-9 text-sm">
              <Columns className="h-4 w-4" />
              Customize Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
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
              checked={columnVisibility.service}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({ ...prev, service: value }))
              }
            >
              Service
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.duration}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({ ...prev, duration: value }))
              }
            >
              Duration
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.date}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({ ...prev, date: value }))
              }
            >
              Call Date
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.sentiment}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({ ...prev, sentiment: value }))
              }
            >
              Sentiment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.type}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({ ...prev, type: value }))
              }
            >
              Call Type
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
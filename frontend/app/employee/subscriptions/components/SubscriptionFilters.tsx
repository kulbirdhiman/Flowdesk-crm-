"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Settings 
} from "lucide-react";

interface SubscriptionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  categoryFilter: string[];
  setCategoryFilter: (category: string[]) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  showColumnPopover: boolean;
  setShowColumnPopover: (show: boolean) => void;
  visibleColumns: {
    subscription: boolean;
    vendor: boolean;
    status: boolean;
    category: boolean;
    plan: boolean;
    billing: boolean;
    expires: boolean;
    actions: boolean;
  };
  toggleColumn: (column: string) => void;
  resetColumns: () => void;
}

export default function SubscriptionFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  viewMode,
  setViewMode,
  showColumnPopover,
  setShowColumnPopover,
  visibleColumns,
  toggleColumn,
  resetColumns
}: SubscriptionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Status Filter - Multi-selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-40 justify-start text-left font-normal text-sm">
            <Filter className="mr-2 h-4 w-4" />
            {statusFilter.length === 0 ? "All Status" : `${statusFilter.length} selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filter by Status</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter(["Active", "Paused", "Inactive", "Cancelled"])}
                  className="h-6 px-2 text-xs"
                >
                  Select All
                </Button>
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
          </div>
          <div className="p-2 space-y-2">
            {["Active", "Paused", "Inactive", "Cancelled"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter(prev => [...prev, status]);
                    } else {
                      setStatusFilter(prev => prev.filter(s => s !== status));
                    }
                  }}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Category Filter - Multi-selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-40 justify-start text-left font-normal text-sm">
            <Filter className="mr-2 h-4 w-4" />
            {categoryFilter.length === 0 ? "All Categories" : `${categoryFilter.length} selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filter by Category</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryFilter(["SaaS", "Marketing", "Cloud", "Productivity", "Security", "Finance", "Communication", "Other"])}
                  className="h-6 px-2 text-xs"
                >
                  Select All
                </Button>
                {categoryFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCategoryFilter([])}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="p-2 space-y-2">
            {["SaaS", "Marketing", "Cloud", "Productivity", "Security", "Finance", "Communication", "Other"].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={categoryFilter.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCategoryFilter(prev => [...prev, category]);
                    } else {
                      setCategoryFilter(prev => prev.filter(c => c !== category));
                    }
                  }}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Clear All Filters Button */}
      {(statusFilter.length > 0 || categoryFilter.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatusFilter([]);
            setCategoryFilter([]);
          }}
          className="text-xs"
        >
          Clear All Filters
        </Button>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
        >
          <List className="h-4 w-4" />
        </Button>
        {viewMode === 'table' && (
          <Popover open={showColumnPopover} onOpenChange={setShowColumnPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subscription"
                      checked={visibleColumns.subscription}
                      onCheckedChange={() => toggleColumn("subscription")}
                    />
                    <label htmlFor="subscription" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Subscription
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vendor"
                      checked={visibleColumns.vendor}
                      onCheckedChange={() => toggleColumn("vendor")}
                    />
                    <label htmlFor="vendor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Vendor
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
                      id="category"
                      checked={visibleColumns.category}
                      onCheckedChange={() => toggleColumn("category")}
                    />
                    <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Category
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="plan"
                      checked={visibleColumns.plan}
                      onCheckedChange={() => toggleColumn("plan")}
                    />
                    <label htmlFor="plan" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Plan
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billing"
                      checked={visibleColumns.billing}
                      onCheckedChange={() => toggleColumn("billing")}
                    />
                    <label htmlFor="billing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Billing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expires"
                      checked={visibleColumns.expires}
                      onCheckedChange={() => toggleColumn("expires")}
                    />
                    <label htmlFor="expires" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Expires
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
        )}
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  ChevronDown, 
  Settings, 
  Grid3X3, 
  List 
} from "lucide-react";

interface SubscriptionFiltersProps {
  currentPage: "dashboard" | "subscriptions" | "details";
  setCurrentPage: (page: "dashboard" | "subscriptions" | "details") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  categoryFilter: string[];
  setCategoryFilter: (category: string[]) => void;
  showKanban: boolean;
  setShowKanban: (show: boolean) => void;
  visibleColumns: {
    subscription: boolean;
    plan: boolean;
    cost: boolean;
    users: boolean;
    annualCost: boolean;
    status: boolean;
    renewal: boolean;
    actions: boolean;
  };
  setVisibleColumns: (columns: any) => void;
  onAddSubscription: () => void;
  allCategories: string[];
}

export default function SubscriptionFilters({
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  showKanban,
  setShowKanban,
  visibleColumns,
  setVisibleColumns,
  onAddSubscription,
  allCategories
}: SubscriptionFiltersProps) {
  return (
    <div className="flex items-center gap-3 px-4 pb-2 flex-shrink-0 flex-wrap">
      {/* Dashboard/Subscriptions Toggle */}
      <div className="flex gap-1 border rounded-md p-1">
        <Button
          variant={currentPage === 'dashboard' ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage('dashboard')}
          className="h-8 px-3"
        >
          Dashboard
        </Button>
        <Button
          variant={currentPage === 'subscriptions' ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage('subscriptions')}
          className="h-8 px-3"
        >
          All Subscriptions
        </Button>
      </div>

      <Input
        placeholder="Search by name or vendor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 min-w-[300px] h-10"
      />

      {/* Add Subscription */}
      <Button onClick={onAddSubscription} className="h-10">
        <Plus className="h-4 w-4 mr-2" />
        Add Subscription
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
            {["Active", "Paused", "Inactive", "Cancelled"].map(status => (
              <div key={status} className="flex items-center space-x-2 px-2 py-1.5">
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
                <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-40 h-10 justify-between">
            {categoryFilter.length === 0 ? "All Categories" : 
             categoryFilter.length === 1 ? categoryFilter[0] : 
             `${categoryFilter.length} Categories`}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Select Categories
          </div>
          <div className="space-y-1">
            {allCategories.map(category => (
              <div key={category} className="flex items-center space-x-2 px-2 py-1.5">
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
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Toggle */}
      <div className="flex gap-1 border rounded-md p-1">
        <Button
          variant={!showKanban ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowKanban(false)}
          className="h-8 px-2"
          title="Table View"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={showKanban ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowKanban(true)}
          className="h-8 px-2"
          title="Kanban View"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Customize Columns Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Settings className="h-4 w-4 mr-2" />
            Customize Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Show/Hide Columns
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-subscription"
                checked={visibleColumns.subscription}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, subscription: !!checked }))
                }
              />
              <Label htmlFor="dropdown-subscription" className="text-sm cursor-pointer">Subscription</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-plan"
                checked={visibleColumns.plan}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, plan: !!checked }))
                }
              />
              <Label htmlFor="dropdown-plan" className="text-sm cursor-pointer">Plan/Tier</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-cost"
                checked={visibleColumns.cost}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, cost: !!checked }))
                }
              />
              <Label htmlFor="dropdown-cost" className="text-sm cursor-pointer">Cost per User</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-users"
                checked={visibleColumns.users}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, users: !!checked }))
                }
              />
              <Label htmlFor="dropdown-users" className="text-sm cursor-pointer">No. of Users</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-annual-cost"
                checked={visibleColumns.annualCost}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, annualCost: !!checked }))
                }
              />
              <Label htmlFor="dropdown-annual-cost" className="text-sm cursor-pointer">Annual Cost</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-status"
                checked={visibleColumns.status}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, status: !!checked }))
                }
              />
              <Label htmlFor="dropdown-status" className="text-sm cursor-pointer">Status</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-renewal"
                checked={visibleColumns.renewal}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, renewal: !!checked }))
                }
              />
              <Label htmlFor="dropdown-renewal" className="text-sm cursor-pointer">Renewal Date</Label>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1.5">
              <Checkbox
                id="dropdown-actions"
                checked={visibleColumns.actions}
                onCheckedChange={(checked) => 
                  setVisibleColumns((prev: any) => ({ ...prev, actions: !!checked }))
                }
              />
              <Label htmlFor="dropdown-actions" className="text-sm cursor-pointer">Actions</Label>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

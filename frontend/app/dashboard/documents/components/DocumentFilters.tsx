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

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (category: string[]) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  showKanban: boolean;
  setShowKanban: (show: boolean) => void;
  visibleColumns: {
    document: boolean;
    category: boolean;
    fileInfo: boolean;
    assignedTo: boolean;
    status: boolean;
    created: boolean;
    actions: boolean;
  };
  setVisibleColumns: (columns: any) => void;
  onAddDocument: () => void;
  categories: string[];
}

export default function DocumentFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  showKanban,
  setShowKanban,
  visibleColumns,
  setVisibleColumns,
  onAddDocument,
  categories
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-3 flex-shrink-0">
      {/* Search + Primary Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[300px] h-10"
        />

        <div className="flex gap-2 items-center">
          {/* Add Document */}
          <Button onClick={onAddDocument} className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>

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
                {categories.map(category => (
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
                {["Active", "Archived", "Deleted"].map(status => (
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
                    id="dropdown-document"
                    checked={visibleColumns.document}
                    onCheckedChange={(checked) => 
                      setVisibleColumns((prev: any) => ({ ...prev, document: !!checked }))
                    }
                  />
                  <Label htmlFor="dropdown-document" className="text-sm cursor-pointer">Document</Label>
                </div>
                <div className="flex items-center space-x-2 px-2 py-1.5">
                  <Checkbox
                    id="dropdown-category"
                    checked={visibleColumns.category}
                    onCheckedChange={(checked) => 
                      setVisibleColumns((prev: any) => ({ ...prev, category: !!checked }))
                    }
                  />
                  <Label htmlFor="dropdown-category" className="text-sm cursor-pointer">Category</Label>
                </div>
                <div className="flex items-center space-x-2 px-2 py-1.5">
                  <Checkbox
                    id="dropdown-file-info"
                    checked={visibleColumns.fileInfo}
                    onCheckedChange={(checked) => 
                      setVisibleColumns((prev: any) => ({ ...prev, fileInfo: !!checked }))
                    }
                  />
                  <Label htmlFor="dropdown-file-info" className="text-sm cursor-pointer">File Info</Label>
                </div>
                <div className="flex items-center space-x-2 px-2 py-1.5">
                  <Checkbox
                    id="dropdown-assigned-to"
                    checked={visibleColumns.assignedTo}
                    onCheckedChange={(checked) => 
                      setVisibleColumns((prev: any) => ({ ...prev, assignedTo: !!checked }))
                    }
                  />
                  <Label htmlFor="dropdown-assigned-to" className="text-sm cursor-pointer">Assigned To</Label>
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
                    id="dropdown-created"
                    checked={visibleColumns.created}
                    onCheckedChange={(checked) => 
                      setVisibleColumns((prev: any) => ({ ...prev, created: !!checked }))
                    }
                  />
                  <Label htmlFor="dropdown-created" className="text-sm cursor-pointer">Created</Label>
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
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Grid3X3, List, Settings } from "lucide-react";

export default function DocumentsActionBar({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  showKanban,
  setShowKanban,
  showColumnPopover,
  setShowColumnPopover,
  visibleColumns,
  toggleColumn,
  resetColumns,
}: any) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[300px] h-10"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 w-40 justify-start text-left font-normal bg-background border-border hover:bg-muted/50">
              <Filter className="mr-2 h-4 w-4" />
              {categoryFilter.length === 0 ? "All Categories" : `${categoryFilter.length} selected`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 bg-background border-border shadow-lg" align="start">
            <div className="px-3 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-foreground" />
                <span className="text-sm font-semibold text-foreground">Categories</span>
              </div>
            </div>
            <div className="px-3 py-2 space-y-1">
              <div className="flex items-center space-x-3 px-2 py-1 hover:bg-muted/50 rounded-md cursor-pointer" onClick={() => setCategoryFilter([])}>
                <Checkbox checked={categoryFilter.length === 0} onCheckedChange={() => setCategoryFilter([])} className="border-border data-[state=checked]:bg-foreground data-[state=checked]:text-background" />
                <span className="text-sm font-medium text-foreground">All Categories</span>
              </div>
              {categories.map((category: string) => (
                <div key={category} className="flex items-center space-x-3 px-2 py-1 hover:bg-muted/50 rounded-md cursor-pointer" onClick={() => {
                  if (categoryFilter.includes(category)) setCategoryFilter(categoryFilter.filter((c: string) => c !== category));
                  else setCategoryFilter([...categoryFilter, category]);
                }}>
                  <Checkbox
                    checked={categoryFilter.includes(category)}
                    onCheckedChange={() => {
                      if (categoryFilter.includes(category)) setCategoryFilter(categoryFilter.filter((c: string) => c !== category));
                      else setCategoryFilter([...categoryFilter, category]);
                    }}
                    className="border-border data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  />
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setCategoryFilter([])} className="w-full h-7 bg-muted/50 border-border text-foreground hover:bg-muted">
                  Reset All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Button variant={!showKanban ? "default" : "outline"} size="sm" onClick={() => setShowKanban(false)} className="h-8">
          <List className="h-4 w-4 mr-2" />
          Table View
        </Button>
        <Button variant={showKanban ? "default" : "outline"} size="sm" onClick={() => setShowKanban(true)} className="h-8">
          <Grid3X3 className="h-4 w-4 mr-2" />
          Kanban View
        </Button>

        <Popover open={showColumnPopover} onOpenChange={setShowColumnPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            {(["document","category","fileInfo","created","actions"] as const).map((key) => (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox id={key} checked={visibleColumns[key]} onCheckedChange={() => toggleColumn(key)} />
                <label htmlFor={key} className="text-sm font-medium">
                  {key === 'fileInfo' ? 'File Info' : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" onClick={resetColumns} className="w-full h-8">
                Reset All
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}



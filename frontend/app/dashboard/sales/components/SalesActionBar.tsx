"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Grid3X3, List, Search, Settings, ChevronDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function SalesActionBar({
  search,
  setSearch,
  range,
  setRange,
  viewType,
  setViewType,
  visibleColumns,
  setVisibleColumns,
}: {
  search: string;
  setSearch: (v: string) => void;
  range: "week" | "month" | "last15";
  setRange: (r: "week" | "month" | "last15") => void;
  viewType: "cards" | "table";
  setViewType: (v: "cards" | "table") => void;
  visibleColumns: any;
  setVisibleColumns: (updater: any) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sales person..." className="pl-8 w-full" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant={range === "week" ? "default" : "outline"} onClick={() => setRange("week")}>This Week</Button>
          <Button size="sm" variant={range === "last15" ? "default" : "outline"} onClick={() => setRange("last15")}>Last 15 Days</Button>
          <Button size="sm" variant={range === "month" ? "default" : "outline"} onClick={() => setRange("month")}>This Month</Button>
        </div>

        <ToggleGroup type="single" value={viewType} onValueChange={(value) => setViewType(value as any)} variant="outline" className="flex">
          <ToggleGroupItem value="cards" aria-label="Cards view">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              <Settings className="h-4 w-4 mr-2" />
              Customize Columns
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <div className="space-y-2">
                <div className="space-y-1">
                  {(["name","today","week","month","last15","actions"] as const).map((key) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <Checkbox
                        id={key}
                        checked={visibleColumns[key]}
                        onCheckedChange={(checked) => setVisibleColumns((prev: any) => ({ ...prev, [key]: checked as boolean }))}
                      />
                      <Label htmlFor={key} className="text-sm">{key === 'last15' ? 'Last 15 Days' : key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setVisibleColumns({ name: true, today: true, week: true, month: true, last15: true, actions: true })}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}



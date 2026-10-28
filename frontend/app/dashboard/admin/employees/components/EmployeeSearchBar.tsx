"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Grid, LayoutGrid, UserPlus } from "lucide-react";

type Employee = Record<string, any>;

export default function EmployeeSearchBar({
  searchTerm,
  setSearchTerm,
  view,
  setView,
  onAdd,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  view: "list" | "grid" | "kanban";
  setView: (v: "list" | "grid" | "kanban") => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-3 flex-shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[300px] h-10"
        />

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView("list")}
            className={view === "list" ? "bg-primary text-primary-foreground" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-primary text-primary-foreground" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView("kanban")}
            className={view === "kanban" ? "bg-primary text-primary-foreground" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={onAdd}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
}



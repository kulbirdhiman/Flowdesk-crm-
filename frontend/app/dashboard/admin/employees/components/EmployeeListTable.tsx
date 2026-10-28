"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit2, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Employee = {
  whalesync_postgres_id: string;
  full_name: string;
  official_email: string;
  employment_type?: string;
  work_mode?: string;
  reporting_manager?: string;
  job_title?: string;
  date_of_joining?: string;
  status: string;
  profile_photo?: string | null;
};

export default function EmployeeListTable({
  employees,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortColumn,
  sortDirection,
}: {
  employees: Employee[];
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
  onDelete: (id: string) => void;
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
}) {
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default" as const;
      case "Resigned":
        return "destructive" as const;
      case "Onboarding":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="w-full rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("name")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Employee
                {renderSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("employment_type")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Employment Type
                {renderSortIcon("employment_type")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("work_mode")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Work Mode
                {renderSortIcon("work_mode")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("reporting_manager")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Reporting Manager
                {renderSortIcon("reporting_manager")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("job_title")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Job Type
                {renderSortIcon("job_title")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("date_of_joining")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Date of Joining
                {renderSortIcon("date_of_joining")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("status")} className="h-7 px-2 hover:bg-transparent text-xs font-semibold">
                Status
                {renderSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp, index) => (
            <TableRow key={`employee-${emp.whalesync_postgres_id}-${index}`} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={emp.profile_photo || "/avatars/default-avatar.png"} alt={emp.full_name || "Employee"} />
                    <AvatarFallback>{(emp.full_name && emp.full_name.charAt(0)) || "E"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{emp.full_name}</div>
                    <div className="text-sm text-muted-foreground">{emp.official_email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{emp.employment_type || "Not specified"}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{emp.work_mode || "Not specified"}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">{emp.reporting_manager || "Not Assigned"}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{emp.job_title || "Not Specified"}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs">
                  {emp.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString() : "Not specified"}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(emp.status)}>{emp.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onView(emp)} className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} className="h-7 w-7">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(emp.whalesync_postgres_id)}
                          className="h-7 w-7"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}



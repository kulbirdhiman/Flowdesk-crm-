"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Lead {
  whalesync_postgres_id: string;
  name?: string;
  mobile?: string;
  email?: string;
  city?: string;
  services?: string;
  source?: string;
  stage?: string;
  date_and_time?: string;
  call_connected?: string;
  assigned_to?: string;
  follow_up_date?: string;
}

interface LeadsTableViewProps {
  leads: Lead[];
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
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (column: string) => void;
  showFollowUpDate: boolean;
  highlightDueToday: boolean;
}

export default function LeadsTableView({
  leads,
  columnVisibility,
  sortColumn,
  sortDirection,
  onSort,
  showFollowUpDate,
  highlightDueToday
}: LeadsTableViewProps) {
  const router = useRouter();

  const getStageColor = (stage?: string) => {
    const s = stage?.toLowerCase() || "";
    if (s.includes("new")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (s.includes("not connected")) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (s.includes("follow up required")) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    if (s.includes("converted")) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (s.includes("lost")) return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  const getServiceColor = (service?: string) => {
    const s = service?.toLowerCase() || "";
    if (s.includes("usa llc formation")) return "border-green-500/50 text-green-700 bg-green-50 dark:border-green-500/30 dark:text-green-400 dark:bg-green-950/30";
    if (s.includes("dropshipping")) return "border-orange-500/50 text-orange-700 bg-orange-50 dark:border-orange-500/30 dark:text-orange-400 dark:bg-orange-950/30";
    if (s.includes("brand development")) return "border-purple-500/50 text-purple-700 bg-purple-50 dark:border-purple-500/30 dark:text-purple-400 dark:bg-purple-950/30";
    if (s.includes("canton fair")) return "border-blue-500/50 text-blue-700 bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:bg-blue-950/30";
    return "border-gray-500/50 text-gray-700 bg-gray-50 dark:border-gray-500/30 dark:text-gray-400 dark:bg-gray-950/30";
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-3 w-3 inline" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-1 h-3 w-3 inline" />;
    }
    return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />;
  };

  return (
    <div className="flex-1 overflow-auto">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="hover:bg-transparent">
            {columnVisibility.date && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("date")}
              >
                Date{getSortIcon("date")}
              </TableHead>
            )}
            {columnVisibility.name && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("name")}
              >
                Name{getSortIcon("name")}
              </TableHead>
            )}
            {columnVisibility.mobile && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("mobile")}
              >
                Mobile{getSortIcon("mobile")}
              </TableHead>
            )}
            {columnVisibility.email && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("email")}
              >
                Email{getSortIcon("email")}
              </TableHead>
            )}
            {columnVisibility.service && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("service")}
              >
                Service{getSortIcon("service")}
              </TableHead>
            )}
            {columnVisibility.city && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("city")}
              >
                City{getSortIcon("city")}
              </TableHead>
            )}
            {columnVisibility.source && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("source")}
              >
                Source{getSortIcon("source")}
              </TableHead>
            )}
            {columnVisibility.stage && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("stage")}
              >
                Stage{getSortIcon("stage")}
              </TableHead>
            )}
            {showFollowUpDate && columnVisibility.followup && (
              <TableHead 
                className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                onClick={() => onSort("followup")}
              >
                Follow-up{getSortIcon("followup")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showFollowUpDate ? 9 : 8}
                className="text-center py-8 text-xs text-muted-foreground"
              >
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => {
              const dueToday = false;
              return (
                <TableRow
                  key={lead.whalesync_postgres_id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    dueToday ? "bg-yellow-50 dark:bg-yellow-900/10" : ""
                  }`}
                  onClick={() => router.push(`/employee/leads/${lead.whalesync_postgres_id}`)}
                >
                  {columnVisibility.date && (
                    <TableCell className="px-3 py-3 text-sm whitespace-nowrap">
                      {lead.date_and_time
                        ? new Date(lead.date_and_time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                  )}
                  {columnVisibility.name && (
                    <TableCell 
                      className="px-3 py-3 text-sm font-medium"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button[data-action]')) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/employee/leads/${lead.whalesync_postgres_id}`);
                          }}
                          data-action="view"
                          className="h-6 w-6 hover:bg-muted flex-shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium truncate max-w-[100px]" title={lead.name || ""}>
                          {lead.name || "-"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.mobile && (
                    <TableCell className="px-3 py-3 text-sm whitespace-nowrap">{lead.mobile || "-"}</TableCell>
                  )}
                  {columnVisibility.email && (
                    <TableCell className="px-3 py-3 text-sm max-w-[120px] truncate">{lead.email || "-"}</TableCell>
                  )}
                  {columnVisibility.service && (
                    <TableCell className="px-3 py-3">
                      {lead.services ? (
                        <Badge variant="outline" className={`${getServiceColor(lead.services)} text-sm px-2 py-1 border`}>
                          {lead.services}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.city && (
                    <TableCell className="px-3 py-3 text-sm">{lead.city || "-"}</TableCell>
                  )}
                  {columnVisibility.source && (
                    <TableCell className="px-3 py-3 text-sm">{lead.source || "-"}</TableCell>
                  )}
                  {columnVisibility.stage && (
                    <TableCell className="px-3 py-3">
                      <Badge className={`${getStageColor(lead.stage)} text-sm px-2 py-1`}>
                        {lead.stage || "-"}
                      </Badge>
                    </TableCell>
                  )}
                  {showFollowUpDate && columnVisibility.followup && (
                    <TableCell className="px-3 py-3 text-sm">
                      {lead.follow_up_date ? (
                        <Badge variant="outline" className="text-sm px-2 py-1">
                          {new Date(lead.follow_up_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

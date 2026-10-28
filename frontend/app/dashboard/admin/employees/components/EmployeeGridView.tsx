"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Employee = {
  whalesync_postgres_id: string;
  full_name: string;
  official_email: string;
  employment_type?: string;
  work_mode?: string;
  status: string;
  profile_photo?: string | null;
  job_title?: string;
  reporting_manager?: string;
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

export default function EmployeeGridView({
  employees,
  onView,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {employees.map((emp, index) => (
        <div
          key={`employee-grid-${emp.whalesync_postgres_id}-${index}`}
          className="bg-card border border-primary/20 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={emp.profile_photo || "/avatars/default-avatar.png"} alt={emp.full_name || "Employee"} className="object-cover" />
              <AvatarFallback className="text-sm font-semibold bg-muted">
                {(emp.full_name && emp.full_name.charAt(0)) || "E"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground mb-1">{emp.full_name}</h3>
              <Badge variant="secondary" className="text-xs">{emp.employment_type || "Not specified"}</Badge>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Type</span>
              </div>
              <span className="text-xs text-foreground">{emp.employment_type || "Not specified"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Work Mode</span>
              </div>
              <span className="text-xs text-foreground">{emp.work_mode || "Not specified"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Status</span>
              </div>
              <Badge variant={getStatusBadgeVariant(emp.status)} className="text-xs">{emp.status}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="bg-muted/50 rounded-md p-2 min-w-[60px]">
                <div className="text-sm font-bold text-foreground">98%</div>
                <div className="text-[10px] text-muted-foreground">Performance</div>
              </div>

              <div className="bg-muted/50 rounded-md p-2 min-w-[60px]">
                <div className="text-sm font-bold text-foreground">4.8</div>
                <div className="text-[10px] text-muted-foreground">Rating</div>
              </div>
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onView(emp)} className="h-6 w-6">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="bg-black text-white">
                    <p>View details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(emp)} className="h-6 w-6">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="bg-black text-white">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(emp.whalesync_postgres_id)} className="h-6 w-6">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="bg-black text-white">
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </div>
  );
}



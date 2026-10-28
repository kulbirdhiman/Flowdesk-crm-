"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface EmployeeData {
  id?: number;
  whalesync_postgres_id: string;
  full_name: string;
  official_email?: string;
  job_title?: string;
  profile_photo?: string;
  department_data?: {
    whalesync_postgres_id: string;
    department_name: string;
  };
}

interface EmployeeHeaderProps {
  employeeData: EmployeeData | null;
  getDepartmentName: () => string;
}

export default function EmployeeHeader({ employeeData, getDepartmentName }: EmployeeHeaderProps) {
  if (!employeeData) return null;

  return (
    <div className="flex items-start gap-6 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={employeeData.profile_photo} alt={employeeData.full_name} />
        <AvatarFallback className="text-2xl font-semibold">{employeeData.full_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{employeeData.full_name}</h2>
            <p className="text-lg text-muted-foreground">{employeeData.job_title || "No Position"}</p>
            <p className="text-sm text-muted-foreground">{employeeData.official_email}</p>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              ID: {employeeData.whalesync_postgres_id?.substring(0, 8)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getDepartmentName()}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

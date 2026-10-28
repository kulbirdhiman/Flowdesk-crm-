"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";

interface EmployeeData {
  id?: number;
  whalesync_postgres_id: string;
  full_name: string;
  official_email?: string;
  official_contact_number?: string;
  job_title?: string;
  date_of_joining?: string;
  employment_type?: string;
  status?: string;
  profile_photo?: string;
  linkedin_profile?: string;
  department?: string;
  reporting_manager?: string;
  monthly_payroll?: number;
  work_mode?: string;
  dob?: string;
  personal_email?: string;
  department_data?: {
    whalesync_postgres_id: string;
    department_name: string;
  };
  manager_data?: {
    whalesync_postgres_id: string;
    full_name: string;
    profile_photo?: string;
    job_title?: string;
    official_email?: string;
  };
}

interface EmployeeInfoCardsProps {
  employeeData: EmployeeData | null;
  manager: EmployeeData | null;
  directReports: EmployeeData[];
  getDepartmentName: () => string;
}

export default function EmployeeInfoCards({ 
  employeeData, 
  manager, 
  directReports, 
  getDepartmentName 
}: EmployeeInfoCardsProps) {
  if (!employeeData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="text-sm font-medium">{employeeData.official_contact_number || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Personal Email</span>
            <span className="text-sm font-medium">{employeeData.personal_email || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date of Birth</span>
            <span className="text-sm font-medium">
              {employeeData.dob ? new Date(employeeData.dob).toLocaleDateString("en-GB") : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">LinkedIn</span>
            {employeeData.linkedin_profile ? (
              <a
                href={employeeData.linkedin_profile.startsWith("http") ? employeeData.linkedin_profile : `https://${employeeData.linkedin_profile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Linkedin className="h-3 w-3" />
                Profile
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Department</span>
            <span className="text-sm font-medium">{getDepartmentName()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Position</span>
            <span className="text-sm font-medium">{employeeData.job_title || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Joining Date</span>
            <span className="text-sm font-medium">
              {employeeData.date_of_joining
                ? new Date(employeeData.date_of_joining).toLocaleDateString("en-GB")
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Employment Type</span>
            <span className="text-sm font-medium">{employeeData.employment_type || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Work Mode</span>
            <span className="text-sm font-medium">{employeeData.work_mode || "N/A"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Management Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Manager</span>
            <span className="text-sm font-medium">{manager?.full_name || "No Manager"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Direct Reports</span>
            <span className="text-sm font-medium">{directReports.length} employees</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={employeeData.status === "Active" ? "default" : "secondary"} className="text-xs">
              {employeeData.status || "Unknown"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Payroll</span>
            <span className="text-sm font-medium">
              {employeeData.monthly_payroll ? `₹${employeeData.monthly_payroll.toLocaleString()}` : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

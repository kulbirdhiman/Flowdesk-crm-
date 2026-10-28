"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

type Employee = {
  full_name: string;
  official_email: string;
  status: string;
  profile_photo?: string | null;
  employee_id?: string;
  employment_type?: string;
  work_mode?: string;
  date_of_joining?: string;
  personal_email?: string;
  official_contact_number?: string;
  personal_contact_number?: string;
  linkedin_profile?: string;
  current_address?: string;
  permanent_address?: string;
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  dob?: string;
  total_working_days_this_month?: number;
  Notes?: string;
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

export default function EmployeeDetailsModal({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Details
          </DialogTitle>
          <DialogDescription>Complete information about {employee?.full_name}</DialogDescription>
        </DialogHeader>

        {employee && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={employee.profile_photo || "/avatars/default-avatar.png"} alt={employee.full_name || "Employee"} />
                      <AvatarFallback className="text-lg">{(employee.full_name && employee.full_name.charAt(0)) || "E"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{employee.full_name}</h3>
                      <p className="text-muted-foreground">{employee.official_email}</p>
                      <Badge variant={getStatusBadgeVariant(employee.status)} className="mt-1">
                        {employee.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Employee ID:</span>
                      <p className="text-muted-foreground">{employee.employee_id || "Not assigned"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Employment Type:</span>
                      <p className="text-muted-foreground">{employee.employment_type || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Work Mode:</span>
                      <p className="text-muted-foreground">{employee.work_mode || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date of Joining:</span>
                      <p className="text-muted-foreground">
                        {employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Official Email:</span>
                    <p className="text-muted-foreground">{employee.official_email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Personal Email:</span>
                    <p className="text-muted-foreground">{employee.personal_email || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Official Contact:</span>
                    <p className="text-muted-foreground">{employee.official_contact_number || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Personal Contact:</span>
                    <p className="text-muted-foreground">{employee.personal_contact_number || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">LinkedIn:</span>
                    <p className="text-muted-foreground">
                      {employee.linkedin_profile ? (
                        <a href={employee.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Current Address:</span>
                  <p className="text-muted-foreground">{employee.current_address || "Not provided"}</p>
                </div>
                <div>
                  <span className="font-medium">Permanent Address:</span>
                  <p className="text-muted-foreground">{employee.permanent_address || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Aadhar Number:</span>
                    <p className="text-muted-foreground">{employee.aadhar_number || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">PAN Number:</span>
                    <p className="text-muted-foreground">{employee.pan_number || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">UAN Number:</span>
                    <p className="text-muted-foreground">{employee.uan_number || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p className="text-muted-foreground">{employee.dob ? new Date(employee.dob).toLocaleDateString() : "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Working Days:</span>
                    <p className="text-muted-foreground">{employee.total_working_days_this_month || "Not tracked"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {employee.Notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{employee.Notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}



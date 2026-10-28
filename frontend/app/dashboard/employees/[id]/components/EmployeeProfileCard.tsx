"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmployeeData {
  id: number
  full_name: string
  official_email: string
  job_title?: string
  date_of_joining?: string
  profile_photo?: string
}

interface Department {
  department_name: string
}

interface Manager {
  full_name: string
}

interface EmployeeProfileCardProps {
  employeeData: EmployeeData
  department?: Department | null
  manager?: Manager | null
}

export default function EmployeeProfileCard({
  employeeData,
  department,
  manager
}: EmployeeProfileCardProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={employeeData.profile_photo} alt={employeeData.full_name} />
          <AvatarFallback className="text-2xl">{employeeData.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-md font-bold">{employeeData.full_name}</h3>
        <p className="text-xs text-muted-foreground">{employeeData.official_email}</p>
        <div className="mt-2">
          <p className="text-sm font-semibold text-primary">{employeeData.job_title || "N/A"}</p>
          <p className="text-xs text-muted-foreground">ID: {employeeData.id}</p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs w-full">
          <Card className="bg-background">
            <CardContent className="p-2">
              <p className="text-muted-foreground text-xs">Department</p>
              <p className="font-semibold text-sm">{department?.department_name || "N/A"}</p>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardContent className="p-2">
              <p className="text-muted-foreground text-xs">Joining Date</p>
              <p className="font-semibold text-sm">
                {employeeData.date_of_joining
                  ? new Date(employeeData.date_of_joining).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardContent className="p-2">
              <p className="text-muted-foreground text-xs">Manager</p>
              <p className="font-semibold text-sm">{manager?.full_name || "N/A"}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

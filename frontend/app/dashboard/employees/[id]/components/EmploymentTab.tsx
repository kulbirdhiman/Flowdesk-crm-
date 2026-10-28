"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Plus } from "lucide-react"

interface EmployeeData {
  id: number
  full_name: string
  employment_type?: string
}

interface Manager {
  full_name: string
  profile_photo?: string
}

interface DirectReport {
  id: number
  full_name: string
  profile_photo?: string
}

interface EmploymentTabProps {
  employeeData: EmployeeData
  manager?: Manager | null
  directReports: DirectReport[]
}

export default function EmploymentTab({
  employeeData,
  manager,
  directReports
}: EmploymentTabProps) {
  return (
    <div className="mt-0 space-y-3">
      <Card className="bg-muted/30">
        <CardContent className="p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Position</span>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{employeeData.employment_type || "N/A"}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Manager</span>
          <div className="flex items-center space-x-2">
            {manager && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={manager.profile_photo} alt={manager.full_name} />
                  <AvatarFallback>{manager.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{manager.full_name}</span>
              </>
            )}
            {!manager && <span className="text-sm text-muted-foreground">No manager assigned</span>}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Who Reports to {employeeData.full_name}</span>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {directReports.slice(0, 4).map((report) => (
                <Avatar key={report.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={report.profile_photo} alt={report.full_name} />
                  <AvatarFallback>{report.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {directReports.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold border-2 border-background">
                  +{directReports.length - 4}
                </div>
              )}
            </div>
            {directReports.length === 0 && <span className="text-sm text-muted-foreground">No direct reports</span>}
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Office</span>
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">SS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Startup Squad Pvt. Ltd.</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

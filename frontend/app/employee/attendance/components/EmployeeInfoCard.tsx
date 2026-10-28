"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, RefreshCw } from "lucide-react"

interface EmployeeInfo {
  id: string
  name: string
  isTechTeam: boolean
  photo: string
}

interface EmployeeInfoCardProps {
  employeeInfo: EmployeeInfo
  isLoading: boolean
  onRefresh: () => void
}

export default function EmployeeInfoCard({
  employeeInfo,
  isLoading,
  onRefresh
}: EmployeeInfoCardProps) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            Employee Info
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-primary/20 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            <div>
              <p className="font-semibold">Loading...</p>
              <p className="text-sm text-muted-foreground">Setting up attendance system</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={employeeInfo.photo} alt={employeeInfo.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {employeeInfo.name?.split(' ').map(n => n[0]).join('') || 'E'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{employeeInfo.name || 'Employee'}</p>
              <p className="text-sm text-muted-foreground">
                {employeeInfo.isTechTeam ? 'Tech Team' : 'Regular Team'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Building2 
} from "lucide-react";

interface HRAttendanceKPICardsProps {
  employees: any[];
  attendanceData: any[];
  departmentStats: any[];
}

export default function HRAttendanceKPICards({ 
  employees, 
  attendanceData, 
  departmentStats 
}: HRAttendanceKPICardsProps) {
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendanceData.filter(r => r.date === today && r.status === 'Present').length;
  const attendanceRate = employees.length > 0 ? Math.round((presentToday / employees.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardDescription className="text-sm font-medium">
            Total Employees
          </CardDescription>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">
            {employees.length}
          </CardTitle>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardDescription className="text-sm font-medium">
            Present Today
          </CardDescription>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">
            {presentToday}
          </CardTitle>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardDescription className="text-sm font-medium">
            Attendance Rate
          </CardDescription>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">
            {attendanceRate}%
          </CardTitle>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardDescription className="text-sm font-medium">
            Departments
          </CardDescription>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">
            {departmentStats.length}
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}

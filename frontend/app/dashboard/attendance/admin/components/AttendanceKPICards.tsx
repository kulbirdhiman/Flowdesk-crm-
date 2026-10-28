"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Clock
} from "lucide-react";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  overallAttendanceRate: number;
  departmentsWithIssues: number;
  pendingExceptions: number;
  avgWorkingHours: number;
}

interface AttendanceKPICardsProps {
  dashboardStats: DashboardStats;
}

export function AttendanceKPICards({ dashboardStats }: AttendanceKPICardsProps) {
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
            {dashboardStats.totalEmployees}
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
            {dashboardStats.presentToday}
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
            {dashboardStats.overallAttendanceRate}%
          </CardTitle>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardDescription className="text-sm font-medium">
            Avg Working Hours
          </CardDescription>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">
            {dashboardStats.avgWorkingHours}h
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}

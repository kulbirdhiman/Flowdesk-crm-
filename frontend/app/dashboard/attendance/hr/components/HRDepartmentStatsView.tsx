"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Building2, 
  Users, 
  TrendingUp, 
  Clock, 
  Target 
} from "lucide-react";

interface HRDepartmentStatsViewProps {
  departmentStats: any[];
}

export default function HRDepartmentStatsView({ departmentStats }: HRDepartmentStatsViewProps) {
  const getDepartmentIcon = (deptName: string) => {
    const icons = {
      'Engineering': <Building2 className="h-5 w-5" />,
      'Sales': <TrendingUp className="h-5 w-5" />,
      'Marketing': <Target className="h-5 w-5" />,
      'HR': <Users className="h-5 w-5" />,
      'Finance': <Clock className="h-5 w-5" />
    };
    return icons[deptName as keyof typeof icons] || <Building2 className="h-5 w-5" />;
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBgColor = (rate: number) => {
    if (rate >= 90) return "bg-green-50 border-green-200";
    if (rate >= 80) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Department Performance
        </CardTitle>
        <CardDescription>Real-time attendance statistics by department</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4">
          {departmentStats.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No Department Data</h3>
              <p className="text-sm text-muted-foreground">Department statistics will appear here once data is available.</p>
            </div>
          ) : (
            departmentStats.map((dept, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getAttendanceBgColor(dept.attendance_rate)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background/50 rounded-lg">
                      {getDepartmentIcon(dept.department)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{dept.department}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dept.present_today} of {dept.total_employees} employees present
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getAttendanceColor(dept.attendance_rate)}`}>
                      {dept.attendance_rate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Attendance Rate</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Present Today</span>
                    <span className="font-medium">{dept.present_today}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        dept.attendance_rate >= 90 ? 'bg-green-500' :
                        dept.attendance_rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${dept.attendance_rate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Working Hours</span>
                    <span className="font-medium">{dept.avg_working_hours}h</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

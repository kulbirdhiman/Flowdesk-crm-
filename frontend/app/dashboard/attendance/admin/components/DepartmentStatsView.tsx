"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  CheckCircle, 
  Clock
} from "lucide-react";

interface DepartmentStats {
  department: string;
  total_employees: number;
  present_today: number;
  attendance_rate: number;
  avg_working_hours: number;
}

interface DepartmentStatsViewProps {
  departmentStats: DepartmentStats[];
}

export function DepartmentStatsView({ departmentStats }: DepartmentStatsViewProps) {
  const getJobTitleIcon = (jobTitle: string) => {
    if (!jobTitle) return <Building2 className="h-4 w-4 text-gray-600" />;
    switch (jobTitle.toLowerCase()) {
      case 'sales': return <Target className="h-4 w-4 text-blue-600" />;
      case 'marketing': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'hr': return <Users className="h-4 w-4 text-green-600" />;
      case 'it': return <Zap className="h-4 w-4 text-orange-600" />;
      case 'finance': return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'software engineer': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'manager': return <Users className="h-4 w-4 text-purple-600" />;
      case 'developer': return <Zap className="h-4 w-4 text-green-600" />;
      case 'analyst': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 85) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 95) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (rate >= 85) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departmentStats.map((dept, index) => (
        <Card key={dept.department} className="bg-gradient-to-t from-primary/5 to-card shadow-xs hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  {getJobTitleIcon(dept.department)}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{dept.department}</CardTitle>
                  <CardDescription className="text-xs">
                    {dept.present_today}/{dept.total_employees} present
                  </CardDescription>
                </div>
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getAttendanceColor(dept.attendance_rate)}`}>
                {dept.attendance_rate}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Attendance Rate</span>
                  <span>{dept.attendance_rate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(dept.attendance_rate)}`}
                    style={{ width: `${dept.attendance_rate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>{dept.present_today} Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span>{dept.avg_working_hours}h</span>
                </div>
              </div>

              <div className="flex justify-center">
                {dept.attendance_rate >= 95 && <Badge className="bg-green-100 text-green-800 text-xs">Excellent</Badge>}
                {dept.attendance_rate >= 85 && dept.attendance_rate < 95 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Good</Badge>}
                {dept.attendance_rate < 85 && <Badge className="bg-red-100 text-red-800 text-xs">Needs Attention</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

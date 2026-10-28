"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle
} from "lucide-react";

interface AttendanceRankingsViewProps {
  attendanceData: any[];
  employees: any[];
  jobTitleFilter: string[];
  setJobTitleFilter: (filter: string[]) => void;
}

export function AttendanceRankingsView({
  attendanceData,
  employees,
  jobTitleFilter,
  setJobTitleFilter
}: AttendanceRankingsViewProps) {
  const getRankIcon = (rank: number) => {
    if (rank < 3) {
      const colors = [
        'from-yellow-400 to-yellow-600',
        'from-gray-400 to-gray-600', 
        'from-orange-400 to-orange-600'
      ];
      return (
        <div className={`w-8 h-8 bg-gradient-to-br ${colors[rank]} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg`}>
          {rank + 1}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
        {rank + 1}
      </div>
    );
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 95) return 'from-green-500 to-green-600';
    if (rate >= 85) return 'from-yellow-500 to-yellow-600';
    if (rate >= 70) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  // Calculate rankings
  const allEmployeesFromDB = employees.map(emp => ({
    name: emp.full_name,
    job_title: emp.job_title || 'No Job Title',
    profile_photo: emp.profile_photo,
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    totalHours: 0
  }));

  const attendanceStats = attendanceData.reduce((acc, record) => {
    if (!acc[record.employee_name]) {
      acc[record.employee_name] = {
        name: record.employee_name,
        job_title: record.job_title,
        profile_photo: record.profile_photo,
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        halfDays: 0,
        totalHours: 0
      };
    }
    acc[record.employee_name].totalDays++;
    if (record.status === 'Present') {
      acc[record.employee_name].presentDays++;
      acc[record.employee_name].totalHours += record.working_hours || 0;
    } else if (record.status === 'Absent') {
      acc[record.employee_name].absentDays++;
    } else if (record.status === 'Half Day') {
      acc[record.employee_name].halfDays++;
      acc[record.employee_name].totalHours += record.working_hours || 0;
    }
    return acc;
  }, {} as Record<string, any>);

  let allEmployees = allEmployeesFromDB.map(emp => {
    const attendanceData = attendanceStats[emp.name];
    if (attendanceData) {
      return {
        ...emp,
        ...attendanceData,
        attendanceRate: Math.round((attendanceData.presentDays / attendanceData.totalDays) * 100),
        avgHours: (attendanceData.presentDays + attendanceData.halfDays) > 0 ? Math.round((attendanceData.totalHours / (attendanceData.presentDays + attendanceData.halfDays)) * 10) / 10 : 0
      };
    } else {
      return {
        ...emp,
        attendanceRate: 0,
        avgHours: 0
      };
    }
  }).sort((a, b) => b.attendanceRate - a.attendanceRate);

  // Filter by job title if selected
  if (jobTitleFilter.length > 0) {
    allEmployees = allEmployees.filter(emp => jobTitleFilter.includes(emp.job_title));
  }

  return (
    <div className="space-y-6">
      {/* Header with Job Title Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Attendance Rankings</h3>
          <p className="text-muted-foreground">All employees ranked by attendance performance</p>
        </div>
        
        {/* Job Title Filter */}
        <div className="flex items-center gap-4">
          <Label htmlFor="rankings-job-filter" className="text-sm font-medium">Filter by Job Title:</Label>
          <Select value={jobTitleFilter.length > 0 ? jobTitleFilter[0] : "all"} onValueChange={(value) => {
            if (value === "all") {
              setJobTitleFilter([]);
            } else {
              setJobTitleFilter([value]);
            }
          }}>
            <SelectTrigger id="rankings-job-filter" className="w-48">
              <SelectValue placeholder="All Job Titles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Job Titles</SelectItem>
              {Array.from(new Set(attendanceData.map(record => record.job_title).filter(Boolean))).map(jobTitle => (
                <SelectItem key={jobTitle} value={jobTitle}>{jobTitle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Rankings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allEmployees.map((employee, index) => (
          <Card key={employee.name} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <CardContent className="p-6">
              {/* Header with Photo and Rank */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-border shadow-lg overflow-hidden">
                    {employee.profile_photo ? (
                      <img 
                        src={(() => {
                          const photo = employee.profile_photo;
                          if (photo.startsWith('http')) {
                            return photo;
                          } else if (photo.startsWith('data:')) {
                            return photo;
                          } else if (photo.startsWith('/')) {
                            return `https://grjaqvdoxqendrzzgyjk.supabase.co${photo}`;
                          } else {
                            return `https://grjaqvdoxqendrzzgyjk.supabase.co/storage/v1/object/public/avatars/${photo}`;
                          }
                        })()} 
                        alt={employee.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center text-white font-bold text-lg ${employee.profile_photo ? 'hidden' : 'flex'}`}
                      style={{ 
                        backgroundColor: `hsl(${(employee.name.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
                        backgroundImage: `linear-gradient(135deg, hsl(${(employee.name.charCodeAt(0) * 137.5) % 360}, 70%, 50%), hsl(${((employee.name.charCodeAt(0) * 137.5) + 30) % 360}, 70%, 60%)`
                      }}
                    >
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    {getRankIcon(index)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground mb-1">{employee.name}</h4>
                  <Badge className="bg-muted text-muted-foreground font-medium px-2 py-1 text-xs">
                    {employee.job_title}
                  </Badge>
                </div>
              </div>
              
              {/* Attendance Rate */}
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-foreground mb-1">{employee.attendanceRate}%</div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${getProgressColor(employee.attendanceRate)} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${employee.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{employee.presentDays} present</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{employee.avgHours}h avg</span>
                  </div>
                </div>
                
                {(employee.absentDays > 0 || employee.halfDays > 0) && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {employee.absentDays > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{employee.absentDays} absent</span>
                      </div>
                    )}
                    {employee.halfDays > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{employee.halfDays} half day</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {attendanceData.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground text-lg">No attendance data available</div>
            <p className="text-sm text-muted-foreground mt-2">Attendance rankings will appear here once data is available</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  employee_name: string;
  employee_id: string;
  job_title: string;
  date: string;
  status: string;
  time_in: string;
  time_out: string;
  working_hours: number;
  punctuality_status: string;
  marked_by: string;
  marked_at: string;
  notes: string;
  department?: string;
}

interface MonthlyStats {
  present: number;
  absent: number;
  halfDay: number;
  attendanceRate: number;
}

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: AttendanceRecord | null;
  monthlyStats: MonthlyStats;
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

export function EmployeeDetailsModal({
  isOpen,
  onClose,
  selectedRecord,
  monthlyStats,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange
}: EmployeeDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-100 text-green-800 rounded-full">Present</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-800 rounded-full">Absent</Badge>;
      case 'Half Day':
        return <Badge className="bg-yellow-100 text-yellow-800 rounded-full">Half Day</Badge>;
      case 'Holiday':
        return <Badge className="bg-purple-100 text-purple-800 rounded-full">Holiday</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 rounded-full">{status}</Badge>;
    }
  };

  if (!selectedRecord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            Employee Attendance Details
          </DialogTitle>
          <DialogDescription>
            Detailed attendance information for {selectedRecord.employee_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{selectedRecord.employee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="font-medium">{selectedRecord.employee_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{selectedRecord.department || selectedRecord.job_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedRecord.date}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time In:</span>
                  <span className="font-medium">{selectedRecord.time_in}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Out:</span>
                  <span className="font-medium">{selectedRecord.time_out}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Working Hours:</span>
                  <span className="font-medium">{selectedRecord.working_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marked By:</span>
                  <span className="font-medium">{selectedRecord.marked_by}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Statistics Section */}
          <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Monthly Statistics</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={selectedMonth} onValueChange={onMonthChange}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={onYearChange}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-green-600 dark:text-green-400">Present</span>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums text-green-700 dark:text-green-300">
                      {monthlyStats.present}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-red-600 dark:text-red-400">Absent</span>
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums text-red-700 dark:text-red-300">
                      {monthlyStats.absent}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-orange-600 dark:text-orange-400">Half Day</span>
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums text-orange-700 dark:text-orange-300">
                      {monthlyStats.halfDay}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-blue-600 dark:text-blue-400">Attendance Rate</span>
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums text-blue-700 dark:text-blue-300">
                      {monthlyStats.attendanceRate}%
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Calendar Section */}
          <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-muted/50 to-background border rounded-lg p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Sun</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Mon</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Tue</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Wed</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Thu</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Fri</div>
                  <div className="text-center text-sm text-muted-foreground py-2 font-medium">Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  <div className="aspect-square"></div>
                  <div className="aspect-square"></div>
                  <div className="aspect-square"></div>
                  
                  {/* Calendar days */}
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => (
                    <div 
                      key={day} 
                      className={`aspect-square rounded-md flex flex-col items-center justify-center text-sm relative transition-colors ${
                        day === 24 
                          ? 'bg-primary text-primary-foreground border-2 border-primary/20 shadow-sm' 
                          : 'bg-muted/30 hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {day === 24 && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Calendar Legend */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Half Day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Attendance Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This record shows the attendance status for {selectedRecord.employee_name} on {selectedRecord.date}.
                    {selectedRecord.status === 'Present' && ' The employee was present for the full working day.'}
                    {selectedRecord.status === 'Absent' && ' The employee was absent on this day.'}
                    {selectedRecord.status === 'Half Day' && ' The employee worked for half day only.'}
                    {selectedRecord.status === 'Holiday' && ' This was a holiday for the employee.'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Working Hours Analysis</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Total working hours: {selectedRecord.working_hours}h
                    {selectedRecord.working_hours && parseFloat(selectedRecord.working_hours.toString()) >= 8 && ' (Full day)'}
                    {selectedRecord.working_hours && parseFloat(selectedRecord.working_hours.toString()) < 8 && parseFloat(selectedRecord.working_hours.toString()) > 0 && ' (Partial day)'}
                    {selectedRecord.working_hours === 0 && ' (No hours worked)'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

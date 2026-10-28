"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CalendarDays } from "lucide-react";

interface HREmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: any;
  attendanceData: any[];
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  getMonthlyStats: (employeeId: string, month: number, year: number) => any;
  getCalendarDays: (month: number, year: number) => any[];
  handleViewRecord: (record: any) => void;
}

export default function HREmployeeDetailsModal({
  isOpen,
  onClose,
  selectedRecord,
  attendanceData,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  getMonthlyStats,
  getCalendarDays,
  handleViewRecord
}: HREmployeeDetailsModalProps) {
  if (!selectedRecord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            Employee Attendance Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed attendance information and calendar view for {selectedRecord?.employee_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Employee Info */}
          <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-sm font-medium text-muted-foreground">Employee Name</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{selectedRecord.employee_name}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-sm font-medium text-muted-foreground">Employee ID</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{selectedRecord.employee_id}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{selectedRecord.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Statistics */}
          <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Monthly Statistics</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger className="w-24 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const stats = getMonthlyStats(selectedRecord.employee_id, selectedMonth, selectedYear);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-t from-green-500/10 to-green-600/5 border border-green-200/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                      <div className="text-sm text-green-700">Present</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-t from-red-500/10 to-red-600/5 border border-red-200/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                      <div className="text-sm text-red-700">Absent</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-t from-orange-500/10 to-orange-600/5 border border-orange-200/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{stats.halfDay}</div>
                      <div className="text-sm text-orange-700">Half Day</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-t from-blue-500/10 to-blue-600/5 border border-blue-200/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
                      <div className="text-sm text-blue-700">Attendance Rate</div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2">{day}</div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays(selectedMonth, selectedYear).map((day, index) => (
                    <div
                      key={index}
                      className={`
                        aspect-square p-2 text-center text-sm border rounded-lg
                        ${day ? 'bg-background border-border' : 'bg-muted/20'}
                        ${day?.isToday ? 'ring-2 ring-primary' : ''}
                        ${day?.record ? 'cursor-pointer hover:bg-muted/50' : ''}
                      `}
                      onClick={() => day?.record && handleViewRecord(day.record)}
                    >
                      {day && (
                        <>
                          <div className="font-medium text-foreground">{day.day}</div>
                          {day.record && (
                            <div className="mt-1">
                              {day.record.status === 'Present' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                              )}
                              {day.record.status === 'Absent' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mx-auto"></div>
                              )}
                              {day.record.status === 'Half Day' && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto"></div>
                              )}
                              {day.record.status === 'Holiday' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Half Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Holiday</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance Records */}
          <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">Recent Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendanceData
                  .filter(record => record.employee_id === selectedRecord.employee_id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-foreground">{record.date}</div>
                        <div className={`px-2 py-1 text-xs rounded-lg ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'Half Day' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {record.status}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {record.time_in && record.time_out ? `${record.time_in} - ${record.time_out}` : 'N/A'}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

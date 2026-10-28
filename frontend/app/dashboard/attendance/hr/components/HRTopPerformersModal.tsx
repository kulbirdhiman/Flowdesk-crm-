"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";

interface HRTopPerformersModalProps {
  isOpen: boolean;
  onClose: () => void;
  getTopPerformers: () => any[];
  employees: any[];
  attendanceData: any[];
}

export default function HRTopPerformersModal({
  isOpen,
  onClose,
  getTopPerformers,
  employees,
  attendanceData
}: HRTopPerformersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Attendance Performers
          </DialogTitle>
          <DialogDescription>
            Best performing employees based on attendance records
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Top 3 Performers */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">🏆 Top 3 Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTopPerformers().map((performer, index) => (
                  <div key={performer.id} className="p-4 bg-card border border-border rounded-none shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-bold text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-lg">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">{performer.department}</div>
                        <div className="text-xs text-muted-foreground mt-1">Employee ID: {performer.employee_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{performer.attendanceRate}%</div>
                        <div className="text-sm text-muted-foreground">{performer.present} present days</div>
                        <div className="text-xs text-muted-foreground">{performer.halfDay} half days</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Attendance Rate</span>
                        <span>{performer.attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-none h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-none transition-all duration-500"
                          style={{ width: `${performer.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Employees Ranking */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Complete Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employees.map((emp, index) => {
                  const empRecords = attendanceData.filter(record => record.employee_id === emp.employee_id);
                  const present = empRecords.filter(r => r.status === 'Present').length;
                  const halfDay = empRecords.filter(r => r.status === 'Half Day').length;
                  const total = empRecords.length;
                  const attendanceRate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 0;
                  
                  return (
                    <div key={emp.id} className="flex items-center justify-between p-3 border border-border rounded-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{emp.name}</div>
                          <div className="text-sm text-muted-foreground">{emp.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-foreground">{attendanceRate}%</div>
                          <div className="text-xs text-muted-foreground">{present} present</div>
                        </div>
                        <div className="w-20 bg-muted rounded-none h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-none"
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Summary */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Team Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-none">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(employees.reduce((acc, emp) => {
                      const empRecords = attendanceData.filter(record => record.employee_id === emp.employee_id);
                      const present = empRecords.filter(r => r.status === 'Present').length;
                      const halfDay = empRecords.filter(r => r.status === 'Half Day').length;
                      const total = empRecords.length;
                      return acc + (total > 0 ? ((present + halfDay * 0.5) / total) * 100 : 0);
                    }, 0) / employees.length)}
                  </div>
                  <div className="text-sm text-blue-700">Average Attendance Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-none">
                  <div className="text-2xl font-bold text-green-600">
                    {attendanceData.filter(r => r.status === 'Present').length}
                  </div>
                  <div className="text-sm text-green-700">Total Present Days</div>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-none">
                  <div className="text-2xl font-bold text-orange-600">
                    {employees.length}
                  </div>
                  <div className="text-sm text-orange-700">Total Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

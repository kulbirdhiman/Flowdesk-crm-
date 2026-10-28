"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";

interface HRMarkAttendanceViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  employees: any[];
  handleMarkAttendance: (employee: any) => void;
}

export default function HRMarkAttendanceView({
  selectedDate,
  setSelectedDate,
  employees,
  handleMarkAttendance
}: HRMarkAttendanceViewProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Mark Employee Attendance
        </CardTitle>
        <CardDescription>Mark attendance for any employee in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Quick Actions</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                >
                  Yesterday
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Select Employee to Mark Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleMarkAttendance(employee)}
                        className="rounded-none"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Mark
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

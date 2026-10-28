"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  employee_id: string;
  job_title: string;
  profile_photo?: string;
  official_email?: string;
}

interface ManualAttendanceForm {
  status: string;
  timeIn: string;
  timeOut: string;
  notes: string;
}

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee | null) => void;
  form: ManualAttendanceForm;
  onFormChange: (form: ManualAttendanceForm) => void;
  onSubmit: () => void;
}

export function ManualAttendanceModal({
  isOpen,
  onClose,
  employees,
  selectedEmployee,
  onEmployeeSelect,
  form,
  onFormChange,
  onSubmit
}: ManualAttendanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark Manual Attendance</DialogTitle>
          <DialogDescription>
            Manually mark attendance for an employee
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee-select">Select Employee</Label>
            <Select onValueChange={(value) => {
              const employee = employees.find(emp => emp.whalesync_postgres_id === value);
              onEmployeeSelect(employee || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees && employees.length > 0 ? employees.map((employee) => (
                  <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                    {employee.full_name} ({employee.employee_id})
                  </SelectItem>
                )) : (
                  <SelectItem value="no-employees" disabled>
                    No employees available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status-select">Attendance Status</Label>
            <Select 
              value={form.status} 
              onValueChange={(value) => onFormChange({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Half Day">Half Day</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-in">Time In</Label>
              <Input
                id="time-in"
                type="time"
                value={form.timeIn}
                onChange={(e) => onFormChange({ ...form, timeIn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-out">Time Out</Label>
              <Input
                id="time-out"
                type="time"
                value={form.timeOut}
                onChange={(e) => onFormChange({ ...form, timeOut: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this attendance record..."
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!selectedEmployee}>
            Mark Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

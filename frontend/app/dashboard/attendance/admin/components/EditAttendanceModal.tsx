"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface EditForm {
  status: string;
  timeIn: string;
  timeOut: string;
  notes: string;
}

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: AttendanceRecord | null;
  form: EditForm;
  onFormChange: (form: EditForm) => void;
  onSubmit: () => void;
}

export function EditAttendanceModal({
  isOpen,
  onClose,
  editingRecord,
  form,
  onFormChange,
  onSubmit
}: EditAttendanceModalProps) {
  if (!editingRecord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            Update attendance details for {editingRecord.employee_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Employee Info (Read-only) */}
          <div className="space-y-2">
            <Label>Employee</Label>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-medium">{editingRecord.employee_name}</div>
              <div className="text-sm text-muted-foreground">{editingRecord.employee_id} • {editingRecord.department || editingRecord.job_title}</div>
              <div className="text-sm text-muted-foreground">Date: {editingRecord.date}</div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="edit-status-select">Attendance Status</Label>
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
              <Label htmlFor="edit-time-in">Time In</Label>
              <Input
                id="edit-time-in"
                type="time"
                value={form.timeIn}
                onChange={(e) => onFormChange({ ...form, timeIn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time-out">Time Out</Label>
              <Input
                id="edit-time-out"
                type="time"
                value={form.timeOut}
                onChange={(e) => onFormChange({ ...form, timeOut: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
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
          <Button onClick={onSubmit}>
            Update Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

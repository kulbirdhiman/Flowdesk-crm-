"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck } from "lucide-react";

interface HRManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: any;
  attendanceForm: {
    status: string;
    timeIn: string;
    timeOut: string;
    notes: string;
  };
  setAttendanceForm: (form: any) => void;
  handleSubmitAttendance: () => void;
}

export default function HRManualAttendanceModal({
  isOpen,
  onClose,
  selectedEmployee,
  attendanceForm,
  setAttendanceForm,
  handleSubmitAttendance
}: HRManualAttendanceModalProps) {
  if (!selectedEmployee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Mark Attendance
          </DialogTitle>
          <DialogDescription>
            Mark attendance for {selectedEmployee.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{selectedEmployee.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEmployee.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={attendanceForm.status} 
                onValueChange={(value) => setAttendanceForm({...attendanceForm, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeIn">Time In</Label>
                <Input
                  id="timeIn"
                  type="time"
                  value={attendanceForm.timeIn}
                  onChange={(e) => setAttendanceForm({...attendanceForm, timeIn: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="timeOut">Time Out</Label>
                <Input
                  id="timeOut"
                  type="time"
                  value={attendanceForm.timeOut}
                  onChange={(e) => setAttendanceForm({...attendanceForm, timeOut: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={attendanceForm.notes}
                onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAttendance}>
              Mark Attendance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

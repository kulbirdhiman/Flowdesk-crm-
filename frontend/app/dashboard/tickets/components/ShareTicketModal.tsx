"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
  job_title?: string;
}

interface Ticket {
  id: string;
  ticket_number: number;
  client_name: string;
  client_email: string;
  company: string;
  issue: string;
  status: 'New' | 'In Progress' | 'Escalated' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

interface ShareTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: Ticket | null;
  employees: Employee[];
  selectedEmployees: string[];
  onToggleEmployeeSelection: (employeeId: string) => void;
  onToggleSelectAllEmployees: () => void;
  onShareTicket: () => void;
}

export default function ShareTicketModal({
  isOpen,
  onClose,
  selectedTicket,
  employees,
  selectedEmployees,
  onToggleEmployeeSelection,
  onToggleSelectAllEmployees,
  onShareTicket
}: ShareTicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Ticket with Employees</DialogTitle>
          <DialogDescription>
            Select employees to share this ticket with. They will be able to view and collaborate on this ticket.
            {employees.length > 0 && ` (${employees.length} employees available)`}
          </DialogDescription>
        </DialogHeader>
        
        {selectedTicket && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">Ticket #{selectedTicket.ticket_number}</h4>
              <p className="text-sm text-muted-foreground">{selectedTicket.company} - {selectedTicket.issue}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Employees</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleSelectAllEmployees}
                  className="text-xs"
                >
                  {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                {employees.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    No employees found. Loading...
                  </div>
                ) : (
                  employees.map(employee => (
                    <div key={employee.whalesync_postgres_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`share-${employee.whalesync_postgres_id}`}
                        checked={selectedEmployees.includes(employee.whalesync_postgres_id)}
                        onCheckedChange={() => onToggleEmployeeSelection(employee.whalesync_postgres_id)}
                      />
                      <label 
                        htmlFor={`share-${employee.whalesync_postgres_id}`} 
                        className="text-sm flex items-center gap-2 cursor-pointer flex-1"
                      >
                        {employee.profile_photo ? (
                          <img 
                            src={employee.profile_photo} 
                            alt={employee.full_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {employee.full_name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">{employee.full_name}</span>
                        <span className="text-muted-foreground text-xs">({employee.job_title || 'No Title'})</span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onShareTicket}
            disabled={selectedEmployees.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

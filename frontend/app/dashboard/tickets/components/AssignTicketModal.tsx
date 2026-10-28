"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: Ticket | null;
  employees: Employee[];
  onAssignTicket: (ticketId: string, employeeIds: string[]) => void;
}

export default function AssignTicketModal({
  isOpen,
  onClose,
  selectedTicket,
  employees,
  onAssignTicket
}: AssignTicketModalProps) {
  const handleAssign = () => {
    if (!selectedTicket) return;
    
    const selectedEmployees = employees.filter(emp => {
      const checkbox = document.getElementById(emp.whalesync_postgres_id) as HTMLInputElement;
      return checkbox?.checked;
    }).map(emp => emp.whalesync_postgres_id);
    
    onAssignTicket(selectedTicket.id, selectedEmployees);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Ticket to Employees</DialogTitle>
          <DialogDescription>
            Select employees to assign this ticket to. You can assign to multiple employees.
          </DialogDescription>
        </DialogHeader>
        
        {selectedTicket && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">Ticket #{selectedTicket.ticket_number}</h4>
              <p className="text-sm text-muted-foreground">{selectedTicket.company} - {selectedTicket.issue}</p>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
              {employees.map(employee => (
                <div key={employee.whalesync_postgres_id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={employee.whalesync_postgres_id}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={employee.whalesync_postgres_id} className="text-sm flex items-center gap-2">
                    {employee.profile_photo && (
                      <img 
                        src={employee.profile_photo} 
                        alt={employee.full_name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    {employee.full_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

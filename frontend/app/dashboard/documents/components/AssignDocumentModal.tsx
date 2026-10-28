"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
}

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  category: string;
  created_by?: {
    full_name: string;
    profile_photo?: string;
  };
  created_at: string;
  status: string;
  assignments?: {
    employee: {
      full_name: string;
      profile_photo?: string;
    };
    can_view: boolean;
    can_download: boolean;
  }[];
}

interface AssignDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedDocument: Document | null;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  employees: Employee[];
}

export default function AssignDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDocument,
  selectedEmployees,
  setSelectedEmployees,
  employees
}: AssignDocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onClose();
      if (!open) {
        setSelectedEmployees([]);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Document</DialogTitle>
          <DialogDescription>
            Select employees who can access this document.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
            {employees.map(employee => (
              <div key={employee.whalesync_postgres_id} className="flex items-center space-x-2">
                <Checkbox
                  id={`assign-${employee.whalesync_postgres_id}`}
                  checked={selectedEmployees.includes(employee.whalesync_postgres_id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedEmployees([...selectedEmployees, employee.whalesync_postgres_id]);
                    } else {
                      setSelectedEmployees(selectedEmployees.filter(id => id !== employee.whalesync_postgres_id));
                    }
                  }}
                />
                <Label htmlFor={`assign-${employee.whalesync_postgres_id}`} className="text-sm">
                  {employee.full_name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onClose();
            setSelectedEmployees([]);
          }}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

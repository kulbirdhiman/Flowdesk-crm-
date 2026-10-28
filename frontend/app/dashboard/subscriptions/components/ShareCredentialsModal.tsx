"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
}

interface Subscription {
  id: string;
  subscription_name: string;
  credentials?: {
    email?: string;
    password?: string;
  };
}

interface ShareCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedSubscription: Subscription | null;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  employees: Employee[];
}

export default function ShareCredentialsModal({
  isOpen,
  onClose,
  onSubmit,
  selectedSubscription,
  selectedEmployees,
  setSelectedEmployees,
  employees
}: ShareCredentialsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Credentials</DialogTitle>
          <DialogDescription>
            Select employees to share credentials for {selectedSubscription?.subscription_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="employees">Select Employees</Label>
            <Select
              value=""
              onValueChange={(value) => {
                if (!selectedEmployees.includes(value)) {
                  setSelectedEmployees([...selectedEmployees, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employees to add..." />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter(emp => !selectedEmployees.includes(emp.whalesync_postgres_id))
                  .map(employee => (
                    <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedEmployees.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedEmployees.map(employeeId => {
                  const employee = employees.find(emp => emp.whalesync_postgres_id === employeeId);
                  return (
                    <Badge key={employeeId} variant="secondary">
                      {employee?.full_name}
                      <button
                        onClick={() => {
                          setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
                        }}
                        className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          
          {selectedSubscription?.credentials && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Credentials to Share:</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Email: </span>
                  <span className="font-mono text-sm">{selectedSubscription.credentials.email || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Password: </span>
                  <span className="font-mono text-sm">{selectedSubscription.credentials.password || 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={selectedEmployees.length === 0}>
            Share Credentials
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

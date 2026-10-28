"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
}

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newDocument: {
    title: string;
    description: string;
    category: string;
    file: File | null;
    selectedEmployees: string[];
  };
  setNewDocument: (document: any) => void;
  employees: Employee[];
  categories: string[];
}

export default function CreateDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  newDocument,
  setNewDocument,
  employees,
  categories
}: CreateDocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Upload a document and assign it to specific employees.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={newDocument.title}
              onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
              placeholder="Enter document title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newDocument.description}
              onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
              placeholder="Enter document description"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={newDocument.category} onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files?.[0] || null })}
            />
          </div>
          <div>
            <Label>Assign to Employees</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {employees.map(employee => (
                <div key={employee.whalesync_postgres_id} className="flex items-center space-x-2">
                  <Checkbox
                    id={employee.whalesync_postgres_id}
                    checked={newDocument.selectedEmployees.includes(employee.whalesync_postgres_id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewDocument({
                          ...newDocument,
                          selectedEmployees: [...newDocument.selectedEmployees, employee.whalesync_postgres_id]
                        });
                      } else {
                        setNewDocument({
                          ...newDocument,
                          selectedEmployees: newDocument.selectedEmployees.filter(id => id !== employee.whalesync_postgres_id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={employee.whalesync_postgres_id} className="text-sm">
                    {employee.full_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

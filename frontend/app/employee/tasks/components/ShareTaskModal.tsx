"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Share, Upload, File } from "lucide-react";

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharingTask: any;
  shareForm: {
    assignee: string;
    message: string;
  };
  setShareForm: (form: any) => void;
  shareAttachments: File[];
  setShareAttachments: (files: File[]) => void;
  employees: any[];
  handleSaveShare: () => void;
  handleCancelShare: () => void;
  handleFileUpload: (files: FileList | null, setAttachments: (files: File[]) => void) => void;
  removeFile: (index: number, setAttachments: (files: File[]) => void) => void;
}

export default function ShareTaskModal({
  isOpen,
  onClose,
  sharingTask,
  shareForm,
  setShareForm,
  shareAttachments,
  setShareAttachments,
  employees,
  handleSaveShare,
  handleCancelShare,
  handleFileUpload,
  removeFile
}: ShareTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
          <DialogDescription>
            Share this task with another employee. A copy will be created and assigned to them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-assignee">Share With *</Label>
            <Select
              value={shareForm.assignee}
              onValueChange={(value) => setShareForm({ ...shareForm, assignee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="share-message">Message (Optional)</Label>
            <Textarea
              id="share-message"
              value={shareForm.message}
              onChange={(e) => setShareForm({ ...shareForm, message: e.target.value })}
              placeholder="Add a message about why you're sharing this task..."
              rows={3}
            />
          </div>
          
          {/* File Attachments */}
          <div className="grid gap-2">
            <Label>Additional Attachments (Optional)</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                  onChange={(e) => handleFileUpload(e.target.files, setShareAttachments)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('share-file-input')?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
              
              {shareAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {shareAttachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index, setShareAttachments)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {sharingTask && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Task Details:</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Title:</strong> {sharingTask.title}
              </p>
              {sharingTask.description && (
                <p className="text-sm text-muted-foreground">
                  <strong>Description:</strong> {sharingTask.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                <strong>Priority:</strong> {sharingTask.priority}
              </p>
              {sharingTask.due_date && (
                <p className="text-sm text-muted-foreground">
                  <strong>Due Date:</strong> {new Date(sharingTask.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancelShare}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSaveShare}>
            <Share className="mr-2 h-4 w-4" />
            Share Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, File, X } from "lucide-react";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
  downloadFile: (file: { name: string; path: string; size: number; type: string }) => Promise<void>;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  getPriorityColor,
  formatDate,
  downloadFile,
}: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>View full information for this task</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{task.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <Badge variant="secondary" className={`mt-1 text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {String(task.status || '').replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                {task.due_date ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    {formatDate(task.due_date)}
                  </>
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </div>
            </div>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Attachments</p>
              <div className="space-y-1">
                {(task.attachments as any[]).map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[360px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadFile(file)} className="h-7 px-2">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}



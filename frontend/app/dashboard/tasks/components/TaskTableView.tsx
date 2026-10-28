"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, Share, Trash2, Paperclip } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assignee?: string;
  created_at?: string;
  updated_at?: string;
  completed_on?: string;
  is_overdue?: boolean;
  days_overdue?: number;
  update_count?: number;
  attachments?: Array<{
    name: string;
    path: string;
    size: number;
    type: string;
  }>;
}

interface TaskTableViewProps {
  tasks: Task[];
  visibleColumns: {
    task: boolean;
    assignee: boolean;
    status: boolean;
    priority: boolean;
    dueDate: boolean;
    actions: boolean;
  };
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onShareTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  getAssigneeName: (assigneeId: string) => string;
  getAssigneePhoto: (assigneeId: string) => string;
  getPriorityColor: (priority: string) => string;
}

export default function TaskTableView({
  tasks,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onUpdateStatus,
  onShareTask,
  onDeleteTask,
  getAssigneeName,
  getAssigneePhoto,
  getPriorityColor
}: TaskTableViewProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {visibleColumns.task && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("title")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Task
                  {getSortIcon("title")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.assignee && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("assignee")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Assignee
                  {getSortIcon("assignee")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.status && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("status")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.priority && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("priority")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Priority
                  {getSortIcon("priority")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.dueDate && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("due_date")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Due Date
                  {getSortIcon("due_date")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.actions && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks
            .sort((a, b) => {
              let aValue: any = a[sortField as keyof Task];
              let bValue: any = b[sortField as keyof Task];
              
              if (sortField === "due_date") {
                aValue = aValue ? new Date(aValue).getTime() : 0;
                bValue = bValue ? new Date(bValue).getTime() : 0;
              } else if (sortField === "assignee") {
                aValue = getAssigneeName(a.assignee || "");
                bValue = getAssigneeName(b.assignee || "");
              } else if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
              }
              
              if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1;
              } else {
                return aValue < bValue ? 1 : -1;
              }
            })
            .map((task) => (
              <TableRow key={task.id} className="hover:bg-muted/50">
                {visibleColumns.task && (
                  <TableCell className="px-3 py-3">
                    <div>
                      <div className="font-medium text-sm">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={task.description}>
                          {task.description}
                        </div>
                      )}
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {task.attachments.length} attachment(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.assignee && (
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getAssigneePhoto(task.assignee || "")} />
                        <AvatarFallback className="text-xs">
                          {getAssigneeName(task.assignee || "").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{getAssigneeName(task.assignee || "")}</span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell className="px-3 py-3">
                    <Select
                      value={task.status}
                      onValueChange={(value) => onUpdateStatus(task.id, value)}
                    >
                      <SelectTrigger className="h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                )}
                {visibleColumns.priority && (
                  <TableCell className="px-3 py-3">
                    <Badge variant={getPriorityColor(task.priority) as any}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.dueDate && (
                  <TableCell className="px-3 py-3">
                    {task.due_date ? (
                      <span className="text-sm">
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">No due date</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell className="px-3 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShareTask(task)}
                        className="h-8 w-8 p-0"
                        title="Share task"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTask(task.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

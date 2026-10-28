"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Share, 
  Calendar, 
  Paperclip 
} from "lucide-react";

interface TaskTableViewProps {
  filteredTasks: any[];
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
  handleEditTask: (task: any) => void;
  handleShareTask: (task: any) => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
  isOverdue: (date: string) => boolean;
  onRowClick?: (task: any) => void;
}

export default function TaskTableView({
  filteredTasks,
  sortField,
  sortDirection,
  handleSort,
  handleEditTask,
  handleShareTask,
  getPriorityColor,
  formatDate,
  isOverdue,
  onRowClick
}: TaskTableViewProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4 text-foreground" /> : 
      <ArrowDown className="h-4 w-4 text-foreground" />;
  };

  const getPreviewText = (text: any, maxWords = 7, maxChars = 80) => {
    const s = String(text || "").trim();
    if (!s) return "";
    const words = s.split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    if (s.length > maxChars) {
      return s.slice(0, maxChars).trimEnd() + "...";
    }
    return s;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Title
                {getSortIcon("title")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("priority")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Priority
                {getSortIcon("priority")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("due_date")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Due Date
                {getSortIcon("due_date")}
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="text-center">
                  <div className="text-muted-foreground mb-2">No tasks found</div>
                  <div className="text-sm text-muted-foreground">
                    Try adjusting your filters or create a new task
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onRowClick ? onRowClick(task) : undefined}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold text-foreground">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {getPreviewText(task.description, 7, 80)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.due_date ? (
                    <div className={`flex items-center gap-1 text-sm ${
                      isOverdue(task.due_date) ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      {formatDate(task.due_date)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShareTask(task)}
                      className="h-8 w-8 p-0"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3 w-3" />
                        {task.attachments.length}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

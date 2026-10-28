"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  Calendar, 
  Share, 
  X, 
  File, 
  Paperclip 
} from "lucide-react";

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

interface TaskKanbanViewProps {
  tasks: Task[];
  onDragEnd: (result: any) => void;
  onShareTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onDownloadFile: (file: { name: string; path: string; size: number; type: string }) => void;
  getAssigneeName: (assigneeId: string) => string;
  getAssigneePhoto: (assigneeId: string) => string;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

export default function TaskKanbanView({
  tasks,
  onDragEnd,
  onShareTask,
  onDeleteTask,
  onTaskClick,
  onDownloadFile,
  getAssigneeName,
  getAssigneePhoto,
  getPriorityColor,
  getStatusColor
}: TaskKanbanViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["pending", "in_progress", "completed"].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
              <h3 className="font-semibold capitalize">{status.replace('_', ' ')}</h3>
              <Badge variant="secondary" className="ml-auto">
                {tasks.filter(task => task.status === status).length}
              </Badge>
            </div>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                    snapshot.isDraggingOver ? 'bg-primary/5' : ''
                  }`}
                >
                  {tasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`hover:shadow-md transition-shadow cursor-pointer ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-sm">{task.title}</CardTitle>
                                  {task.description && (
                                    <CardDescription className="text-xs">
                                      {task.description}
                                    </CardDescription>
                                  )}
                                </div>
                                <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={getAssigneePhoto(task.assignee || "")} />
                                    <AvatarFallback className="text-xs">
                                      {getAssigneeName(task.assignee || "").slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{getAssigneeName(task.assignee || "")}</span>
                                </div>
                                
                                {task.due_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(task.due_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Attachments */}
                                {task.attachments && task.attachments.length > 0 && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Paperclip className="h-3 w-3" />
                                      <span>Attachments ({task.attachments.length})</span>
                                    </div>
                                    <div className="space-y-1">
                                      {task.attachments.slice(0, 2).map((file, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDownloadFile(file);
                                          }}
                                          title={`Download ${file.name}`}
                                        >
                                          <File className="h-3 w-3" />
                                          <span className="truncate">{file.name}</span>
                                        </div>
                                      ))}
                                      {task.attachments.length > 2 && (
                                        <div className="text-xs text-muted-foreground">
                                          +{task.attachments.length - 2} more files
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onShareTask(task);
                                    }}
                                    className="h-7 px-2 text-xs"
                                    title="Share task with another employee"
                                  >
                                    <Share className="h-3 w-3 mr-1" />
                                    Share
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteTask(task.id);
                                    }}
                                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

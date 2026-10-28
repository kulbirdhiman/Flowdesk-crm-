"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  GripVertical, 
  Edit, 
  Share, 
  Paperclip 
} from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskKanbanViewProps {
  pendingTasks: any[];
  inProgressTasks: any[];
  completedTasks: any[];
  activeTask: any;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleUpdateStatus: (taskId: string, newStatus: string) => void;
  handleEditTask: (task: any) => void;
  handleShareTask: (task: any) => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
  isOverdue: (date: string) => boolean;
}

// Sortable Task Card Component
const SortableTaskCard = ({ task, onEdit, onShare, getPriorityColor, formatDate, isOverdue }: {
  task: any;
  onEdit: (task: any) => void;
  onShare: (task: any) => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
  isOverdue: (date: string) => boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Share className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`text-xs ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </Badge>
          {task.due_date && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue(task.due_date) ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </div>
          )}
        </div>
        
        {task.attachments && task.attachments.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            {task.attachments.length}
          </div>
        )}
      </div>
      
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ status, children, title, icon, count }: { 
  status: string; 
  children: React.ReactNode; 
  title: string; 
  icon: React.ReactNode; 
  count: number;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title} ({count})
        </CardTitle>
      </CardHeader>
      <CardContent 
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] transition-all duration-200 ${
          isOver ? 'bg-muted/50 border-2 border-dashed border-muted-foreground/50' : ''
        }`}
      >
        {children}
        {count === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Drop tasks here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function TaskKanbanView({
  pendingTasks,
  inProgressTasks,
  completedTasks,
  activeTask,
  handleDragStart,
  handleDragEnd,
  handleEditTask,
  handleShareTask,
  getPriorityColor,
  formatDate,
  isOverdue
}: TaskKanbanViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SortableContext items={pendingTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <DroppableColumn
            status="pending"
            title="Pending"
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
            count={pendingTasks.length}
          >
            {pendingTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onShare={handleShareTask}
                getPriorityColor={getPriorityColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))}
          </DroppableColumn>
        </SortableContext>

        <SortableContext items={inProgressTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <DroppableColumn
            status="in_progress"
            title="In Progress"
            icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
            count={inProgressTasks.length}
          >
            {inProgressTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onShare={handleShareTask}
                getPriorityColor={getPriorityColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))}
          </DroppableColumn>
        </SortableContext>

        <SortableContext items={completedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <DroppableColumn
            status="completed"
            title="Completed"
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            count={completedTasks.length}
          >
            {completedTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onShare={handleShareTask}
                getPriorityColor={getPriorityColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))}
          </DroppableColumn>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg rotate-2 scale-105">
            <h3 className="font-semibold text-foreground text-sm">
              {activeTask.title}
            </h3>
            {activeTask.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {activeTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

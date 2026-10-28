"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface TaskCalendarViewProps {
  currentDate: Date;
  navigateMonth: (direction: 'prev' | 'next') => void;
  getDaysInMonth: (date: Date) => (Date | null)[];
  getTasksForDate: (date: Date) => any[];
  isToday: (date: Date) => boolean;
  isOverdue: (date: Date) => boolean;
  handleTaskClick: (task: any) => void;
}

export default function TaskCalendarView({
  currentDate,
  navigateMonth,
  getDaysInMonth,
  getTasksForDate,
  isToday,
  isOverdue,
  handleTaskClick
}: TaskCalendarViewProps) {
  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-xs text-muted-foreground">Click on tasks to view details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="bg-background border-muted-foreground/30 text-foreground hover:bg-muted/50 h-8 px-2"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="bg-background border-muted-foreground/30 text-foreground hover:bg-muted/50 h-8 px-2"
          >
            →
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gradient-to-br from-muted/50 to-background border border-border/50 rounded-lg overflow-hidden shadow-sm">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-xs text-foreground border-r border-border/30 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20 border-r border-b border-border/30 last:border-r-0 bg-muted/20"></div>;
            }

            const tasksForDate = getTasksForDate(date);
            const isCurrentDay = isToday(date);
            const isOverdueDay = isOverdue(date);

            return (
              <div
                key={index}
                className={`h-20 border-r border-b border-border/30 last:border-r-0 p-2 transition-all duration-200 ${
                  isCurrentDay ? 'bg-gradient-to-br from-primary/20 to-primary/5' : ''
                } ${isOverdueDay ? 'bg-gradient-to-br from-gray-400/40 to-gray-300/30' : ''} hover:bg-muted/30`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${
                    isCurrentDay ? 'text-primary' : 'text-foreground'
                  } ${isOverdueDay ? 'text-muted-foreground' : ''}`}>
                    {date.getDate()}
                  </span>
                  {tasksForDate.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {tasksForDate.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {tasksForDate.slice(0, 2).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      onClick={() => handleTaskClick(task)}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      } hover:opacity-80 transition-opacity`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDate.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{tasksForDate.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

interface TaskStatisticsCardsProps {
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export default function TaskStatisticsCards({ stats }: TaskStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pending Tasks Card */}
      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>Pending Tasks</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.pending}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* In Progress Tasks Card */}
      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>In Progress</span>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.inProgress}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Completed Tasks Card */}
      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>Completed</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.completed}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

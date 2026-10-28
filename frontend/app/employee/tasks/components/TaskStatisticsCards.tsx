"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle, PauseCircle } from "lucide-react";

interface TaskStatisticsCardsProps {
  filteredTasks: any[];
  pendingTasks: any[];
  inProgressTasks: any[];
  completedTasks: any[];
}

export default function TaskStatisticsCards({
  filteredTasks,
  pendingTasks,
  inProgressTasks,
  completedTasks
}: TaskStatisticsCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>Total Tasks</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {filteredTasks.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>Pending</span>
            <PauseCircle className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingTasks.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>In Progress</span>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {inProgressTasks.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span>Completed</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedTasks.length}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

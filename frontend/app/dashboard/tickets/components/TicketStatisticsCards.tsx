"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface TicketStats {
  total: number;
  new: number;
  inProgress: number;
  escalated: number;
  resolved: number;
}

interface TicketStatisticsCardsProps {
  stats: TicketStats;
}

export default function TicketStatisticsCards({ stats }: TicketStatisticsCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm font-medium">New</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-2xl font-bold">{stats.new}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-2xl font-bold">{stats.inProgress}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm font-medium">Escalated</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-2xl font-bold">{stats.escalated}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-2xl font-bold">{stats.resolved}</div>
        </CardContent>
      </Card>
    </div>
  );
}

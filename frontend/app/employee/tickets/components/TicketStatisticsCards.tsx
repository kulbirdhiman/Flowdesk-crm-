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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.new}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Escalated</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.escalated}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.resolved}</div>
        </CardContent>
      </Card>
    </div>
  );
}

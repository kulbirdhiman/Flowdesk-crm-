"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Database, Users } from "lucide-react";

export default function OverviewCards({
  stats,
  getHealthColor,
  getHealthIcon,
}: {
  stats: { totalUsers: number; activeUsers: number; systemHealth: string; lastBackup: string; storageUsed: string; apiCalls: number; errorRate: number };
  getHealthColor: (h: string) => string;
  getHealthIcon: (h: string) => JSX.Element;
}) {
  return (
    <div className="px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>System Health</CardTitle>
            <div className={getHealthColor(stats.systemHealth)}>{getHealthIcon(stats.systemHealth)}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.systemHealth}</div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>Last backup: {stats.lastBackup}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.storageUsed}</div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>of 10 GB available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.apiCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>{stats.errorRate}% error rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



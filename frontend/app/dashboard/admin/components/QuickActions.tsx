"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Database, RefreshCw, Settings, Shield, Target, Users, UserPlus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>Roles & Permissions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Settings className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>System Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Database className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>Database</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Bell className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>Notifications</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs" style={{ fontFamily: 'Geist, sans-serif' }}>Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



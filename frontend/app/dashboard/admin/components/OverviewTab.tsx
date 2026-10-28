"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>Database Connection</span>
              <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>API Services</span>
              <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>Email Service</span>
              <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>SMS Service</span>
              <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[{ color: 'bg-green-500', text: 'New user registered: John Doe', time: '2 minutes ago' },
              { color: 'bg-blue-500', text: 'System backup completed', time: '1 hour ago' },
              { color: 'bg-yellow-500', text: 'High API usage detected', time: '3 hours ago' },
              { color: 'bg-green-500', text: 'Role permissions updated', time: '5 hours ago' }].map((item, idx) => (
              <div className="flex items-center gap-3" key={idx}>
                <div className={`w-2 h-2 ${item.color} rounded-full`} />
                <div className="flex-1">
                  <p className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>{item.text}</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



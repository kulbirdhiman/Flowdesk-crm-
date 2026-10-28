"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database, Key, Globe, RefreshCw } from "lucide-react"

export default function AdvancedSettingsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Database className="h-5 w-5" />
            Advanced Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Database Management
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
                Advanced database operations and maintenance tools.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-blue-600" />
                <span className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  API Management
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
                Manage API keys and external service integrations.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Test Connections
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

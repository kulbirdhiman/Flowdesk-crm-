"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Phone 
} from "lucide-react"

export default function DataQualityTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Complete Profiles</span>
              </div>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground">1,234 leads</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Missing Data</span>
              </div>
              <p className="text-2xl font-bold">13%</p>
              <p className="text-sm text-muted-foreground">184 leads</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Valid Emails</span>
              </div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-sm text-muted-foreground">1,416 leads</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Valid Phones</span>
              </div>
              <p className="text-2xl font-bold">91%</p>
              <p className="text-sm text-muted-foreground">1,368 leads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface LeadIntentTabProps {
  leadIntentAnalysis: Array<{ intent: string; count: number; probability: number }>
}

export default function LeadIntentTab({
  leadIntentAnalysis
}: LeadIntentTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Lead Intent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadIntentAnalysis.map((intent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    intent.intent === 'High Intent' ? 'bg-green-500' :
                    intent.intent === 'Medium Intent' ? 'bg-yellow-500' :
                    intent.intent === 'Low Intent' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{intent.intent}</p>
                    <p className="text-sm text-muted-foreground">
                      {intent.count} leads • {intent.probability}% conversion probability
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{intent.count} leads</p>
                  <p className="text-xs text-muted-foreground">{intent.probability}% probability</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

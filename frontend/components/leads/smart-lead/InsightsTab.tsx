"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, 
  Info, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react"

export default function InsightsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Lead Source Optimization</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your referral leads have a 35% higher conversion rate. Consider increasing your referral program budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Data Quality Improvement</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Enriching 50 leads with missing company information could increase conversion rates by 15%.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Follow-up Optimization</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    23 leads haven't been contacted in 7+ days. Immediate follow-up could recover 8 potential conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

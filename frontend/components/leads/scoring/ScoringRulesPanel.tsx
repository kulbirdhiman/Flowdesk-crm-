"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { ScoringRule } from "./types"

interface ScoringRulesPanelProps {
  scoringRules: ScoringRule[]
  onToggleRule: (ruleId: string) => void
}

export default function ScoringRulesPanel({
  scoringRules,
  onToggleRule
}: ScoringRulesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Scoring Rules Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scoringRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted-foreground">{rule.category} • Weight: {rule.weight}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={rule.enabled ? "default" : "secondary"}>
                  {rule.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleRule(rule.id)}
                >
                  {rule.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

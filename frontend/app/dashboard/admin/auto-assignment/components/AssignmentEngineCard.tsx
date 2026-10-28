"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap, Loader2, Sparkles } from "lucide-react"

interface AssignmentEngineCardProps {
  isAssigning: boolean
  assignmentProgress: number
  assignmentLog: React.ReactNode
  onRunAssignment: () => void
}

export default function AssignmentEngineCard({
  isAssigning,
  assignmentProgress,
  assignmentLog,
  onRunAssignment
}: AssignmentEngineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Assignment Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Ready to Execute</h4>
              <p className="text-sm text-muted-foreground">Round-robin distribution active</p>
            </div>
          </div>
          <Button
            onClick={onRunAssignment}
            disabled={isAssigning}
            className="w-full gap-2"
            size="lg"
          >
            {isAssigning && <Loader2 className="h-4 w-4 animate-spin" />}
            <Zap className="h-4 w-4" />
            {isAssigning ? 'Processing...' : 'Run Assignment'}
          </Button>
        </div>
        
        {assignmentLog && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Assignment Status</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {assignmentLog}
            </div>
          </div>
        )}

        {isAssigning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing...</span>
              <span className="text-muted-foreground">{assignmentProgress}%</span>
            </div>
            <Progress value={assignmentProgress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

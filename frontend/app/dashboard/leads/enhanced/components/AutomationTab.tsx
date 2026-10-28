"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bell, Zap, MessageCircle, Brain, Shield, Database } from "lucide-react"
import AutomationWorkflowCard from "./AutomationWorkflowCard"

interface Workflow {
  icon: any
  title: string
  description: string
  status: "Active" | "Draft" | "Paused"
  iconColor: string
}

const DEFAULT_WORKFLOWS: Workflow[] = [
  {
    icon: Bell,
    title: "Follow-up Reminders",
    description: "Automatically send follow-up reminders to sales reps",
    status: "Active",
    iconColor: "text-blue-500"
  },
  {
    icon: Zap,
    title: "Auto-Assignment",
    description: "Automatically assign leads based on rules",
    status: "Active",
    iconColor: "text-yellow-500"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Sequences",
    description: "Automated WhatsApp message sequences",
    status: "Draft",
    iconColor: "text-green-500"
  },
  {
    icon: Brain,
    title: "Lead Scoring",
    description: "Automatic lead scoring and prioritization",
    status: "Active",
    iconColor: "text-purple-500"
  },
  {
    icon: Shield,
    title: "Duplicate Detection",
    description: "Automatically detect and flag duplicate leads",
    status: "Active",
    iconColor: "text-red-500"
  },
  {
    icon: Database,
    title: "Data Enrichment",
    description: "Automatically enrich lead data from external sources",
    status: "Paused",
    iconColor: "text-orange-500"
  }
]

export default function AutomationTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Automation Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_WORKFLOWS.map((workflow, index) => (
                <AutomationWorkflowCard
                  key={index}
                  icon={workflow.icon}
                  title={workflow.title}
                  description={workflow.description}
                  status={workflow.status}
                  iconColor={workflow.iconColor}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface AutomationWorkflowCardProps {
  icon: LucideIcon
  title: string
  description: string
  status: "Active" | "Draft" | "Paused"
  iconColor: string
}

export default function AutomationWorkflowCard({
  icon: Icon,
  title,
  description,
  status,
  iconColor
}: AutomationWorkflowCardProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-blue-100 text-blue-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {description}
      </p>
      <Badge className={getStatusBadgeColor(status)}>
        {status}
      </Badge>
    </Card>
  )
}

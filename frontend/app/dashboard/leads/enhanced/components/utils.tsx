import { LeadMetrics, LeadSource, TrendData, AutomationWorkflow } from "./types"

export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export const formatPercentage = (num: number): string => {
  return `${num}%`
}

export const formatTime = (time: string): string => {
  return time
}

export const getStatusColor = (status: string): string => {
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

export const getTrendColor = (isPositive: boolean): string => {
  return isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}

export const calculateGrowthPercentage = (current: number, previous: number): string => {
  if (previous === 0) return "+0%"
  const growth = ((current - previous) / previous) * 100
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`
}

export const getQualityScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export const getResponseTimeColor = (time: string): string => {
  const hours = parseFloat(time.replace('h', ''))
  if (hours <= 2) return "text-green-600"
  if (hours <= 4) return "text-yellow-600"
  return "text-red-600"
}

export const sortWorkflowsByStatus = (workflows: AutomationWorkflow[]): AutomationWorkflow[] => {
  const statusOrder = { "Active": 0, "Draft": 1, "Paused": 2 }
  return workflows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}

export const filterWorkflowsByStatus = (workflows: AutomationWorkflow[], status: string): AutomationWorkflow[] => {
  return workflows.filter(workflow => workflow.status === status)
}

export const getWorkflowStats = (workflows: AutomationWorkflow[]) => {
  const stats = workflows.reduce((acc, workflow) => {
    acc[workflow.status] = (acc[workflow.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: workflows.length,
    active: stats.Active || 0,
    draft: stats.Draft || 0,
    paused: stats.Paused || 0
  }
}

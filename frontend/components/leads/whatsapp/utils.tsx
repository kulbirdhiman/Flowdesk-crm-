import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock 
} from "lucide-react"
import { WhatsAppMessage, WhatsAppTemplate, Lead } from "./types"

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sent': return <Send className="h-4 w-4 text-blue-500" />
    case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'read': return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
    default: return <Clock className="h-4 w-4 text-gray-500" />
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'sent': return 'text-blue-600'
    case 'delivered': return 'text-green-600'
    case 'read': return 'text-green-700'
    case 'failed': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

export const applyTemplate = (template: WhatsAppTemplate, selectedLead: Lead | null): string => {
  let content = template.content
  
  // Replace variables with actual data
  template.variables.forEach(variable => {
    const value = selectedLead?.[variable] || `{{${variable}}}`
    content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value)
  })

  return content
}

export const createMessage = (
  leadId: string, 
  message: string, 
  selectedLead: Lead | null, 
  template?: string
): WhatsAppMessage => {
  return {
    id: Date.now().toString(),
    leadId,
    leadName: selectedLead?.name || 'Unknown',
    phone: selectedLead?.phone || '',
    message,
    type: 'sent',
    timestamp: new Date().toISOString(),
    status: 'sent',
    template
  }
}

export const updateTemplateUsage = (
  templates: WhatsAppTemplate[], 
  templateId: string
): WhatsAppTemplate[] => {
  return templates.map(template => 
    template.id === templateId 
      ? { 
          ...template, 
          usage: template.usage + 1, 
          lastUsed: new Date().toISOString().split('T')[0] 
        }
      : template
  )
}

export const updateMessageStatus = (
  messages: WhatsAppMessage[], 
  messageId: string, 
  status: string
): WhatsAppMessage[] => {
  return messages.map(msg => 
    msg.id === messageId 
      ? { ...msg, status: status as any }
      : msg
  )
}

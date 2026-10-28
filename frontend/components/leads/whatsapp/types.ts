export interface WhatsAppMessage {
  id: string
  leadId: string
  leadName: string
  phone: string
  message: string
  type: 'sent' | 'received'
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  template?: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  category: string
  content: string
  variables: string[]
  usage: number
  lastUsed: string
}

export interface WhatsAppCampaign {
  id: string
  name: string
  template: string
  recipients: number
  sent: number
  delivered: number
  read: number
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  scheduledAt: string
  createdAt: string
}

export interface Lead {
  whalesync_postgres_id: string
  name: string
  phone: string
  email: string
  city: string
  deal_amount: string
  [key: string]: any
}

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message',
    category: 'Onboarding',
    content: 'Hi {{name}}, welcome to Startup Squad! We\'re excited to help you with {{service}}. How can we assist you today?',
    variables: ['name', 'service'],
    usage: 45,
    lastUsed: '2024-01-15'
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    category: 'Follow-up',
    content: 'Hi {{name}}, this is a friendly reminder about your {{service}} inquiry. Are you ready to move forward?',
    variables: ['name', 'service'],
    usage: 32,
    lastUsed: '2024-01-14'
  },
  {
    id: '3',
    name: 'Meeting Confirmation',
    category: 'Scheduling',
    content: 'Hi {{name}}, your meeting is confirmed for {{date}} at {{time}}. We\'ll discuss your {{service}} requirements.',
    variables: ['name', 'date', 'time', 'service'],
    usage: 28,
    lastUsed: '2024-01-13'
  },
  {
    id: '4',
    name: 'Payment Reminder',
    category: 'Payment',
    content: 'Hi {{name}}, your invoice for {{service}} is due. Amount: ₹{{amount}}. Please complete payment at your earliest convenience.',
    variables: ['name', 'service', 'amount'],
    usage: 15,
    lastUsed: '2024-01-12'
  },
  {
    id: '5',
    name: 'Service Completion',
    category: 'Completion',
    content: 'Hi {{name}}, your {{service}} is now complete! Thank you for choosing Startup Squad. We appreciate your business.',
    variables: ['name', 'service'],
    usage: 22,
    lastUsed: '2024-01-11'
  }
]

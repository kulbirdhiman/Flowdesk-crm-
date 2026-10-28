"use client"

import LeadSelector from "./LeadSelector"
import MessageComposer from "./MessageComposer"
import MessageHistory from "./MessageHistory"
import { WhatsAppMessage } from "./types"

interface Lead {
  whalesync_postgres_id: string
  name: string
  phone: string
  email: string
  city: string
  deal_amount: string
  [key: string]: any
}

interface MessagesTabProps {
  selectedLead: Lead | null
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
  onUseTemplate: () => void
  messages: WhatsAppMessage[]
  loading: boolean
  getStatusIcon: (status: string) => JSX.Element
  getStatusColor: (status: string) => string
}

export default function MessagesTab({
  selectedLead,
  newMessage,
  setNewMessage,
  onSendMessage,
  onUseTemplate,
  messages,
  loading,
  getStatusIcon,
  getStatusColor
}: MessagesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lead Selection */}
        <LeadSelector selectedLead={selectedLead} />

        {/* Message Composer */}
        <MessageComposer
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={onSendMessage}
          onUseTemplate={onUseTemplate}
          selectedLead={selectedLead}
          loading={loading}
        />

        {/* Message History */}
        <MessageHistory
          messages={messages}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  )
}

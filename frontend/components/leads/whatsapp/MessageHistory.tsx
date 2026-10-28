"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  History, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock 
} from "lucide-react"
import { format } from "date-fns"
import { WhatsAppMessage } from "./types"

interface MessageHistoryProps {
  messages: WhatsAppMessage[]
  getStatusIcon: (status: string) => JSX.Element
  getStatusColor: (status: string) => string
}

export default function MessageHistory({
  messages,
  getStatusIcon,
  getStatusColor
}: MessageHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Message History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.type === 'sent' 
                    ? 'bg-green-100 ml-8' 
                    : 'bg-gray-100 mr-8'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium">
                    {message.type === 'sent' ? 'You' : message.leadName}
                  </span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(message.status)}
                    <span className={`text-xs ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

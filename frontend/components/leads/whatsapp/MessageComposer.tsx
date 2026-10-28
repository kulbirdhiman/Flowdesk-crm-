"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, FileText } from "lucide-react"

interface MessageComposerProps {
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
  onUseTemplate: () => void
  selectedLead: any
  loading: boolean
}

export default function MessageComposer({
  newMessage,
  setNewMessage,
  onSendMessage,
  onUseTemplate,
  selectedLead,
  loading
}: MessageComposerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Compose Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUseTemplate}
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            <Button
              size="sm"
              onClick={onSendMessage}
              disabled={!newMessage || !selectedLead || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Megaphone, Lightbulb, Heart, Info, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AnnouncementTypeSelector from "./AnnouncementTypeSelector"
import AnnouncementPreview from "./AnnouncementPreview"

interface AnnouncementData {
  type: 'announcement' | 'thought' | 'motivation' | 'note'
  title: string
  message: string
}

interface AnnouncementEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  announcement: AnnouncementData | null
  onSave: (data: AnnouncementData) => void
  isSaving?: boolean
}

const announcementTypes = [
  { 
    value: 'announcement', 
    label: 'Announcement', 
    icon: Megaphone, 
    gradient: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
    textGradient: 'bg-gradient-to-r from-blue-100 to-blue-200'
  },
  { 
    value: 'thought', 
    label: 'Thought of the Day', 
    icon: Lightbulb, 
    gradient: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-yellow-100 to-orange-100'
  },
  { 
    value: 'motivation', 
    label: 'Motivation', 
    icon: Heart, 
    gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-pink-100 to-rose-100'
  },
  { 
    value: 'note', 
    label: 'Note', 
    icon: Sparkles, 
    gradient: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500',
    textGradient: 'bg-gradient-to-r from-purple-100 to-violet-100'
  },
]

export default function AnnouncementEditDialog({
  isOpen,
  onOpenChange,
  announcement,
  onSave,
  isSaving = false
}: AnnouncementEditDialogProps) {
  const [formType, setFormType] = useState<string>(announcement?.type || 'announcement')
  const [formTitle, setFormTitle] = useState(announcement?.title || '')
  const [formMessage, setFormMessage] = useState(announcement?.message || '')

  const handleSave = () => {
    if (!formTitle.trim() || !formMessage.trim()) {
      return
    }

    const announcementData: AnnouncementData = {
      type: formType as any,
      title: formTitle,
      message: formMessage,
    }

    onSave(announcementData)
  }

  const selectedType = announcementTypes.find(t => t.value === formType)
  const IconComp = selectedType?.icon || Megaphone

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${selectedType?.gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'}`}>
              <IconComp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">
                {announcement ? 'Edit Announcement' : 'Create New Announcement'}
              </div>
              <div className="text-sm text-muted-foreground">
                Type: <span className="font-medium text-foreground">{selectedType?.label || 'Announcement'}</span>
              </div>
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            This will be visible to all active employees
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Type Selection */}
          <AnnouncementTypeSelector
            value={formType}
            onChange={setFormType}
          />

          {/* Announcement Content Header */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
            <div className={`p-2 rounded-lg ${selectedType?.gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'}`}>
              <IconComp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Writing Your {selectedType?.label || 'Announcement'}</div>
              <div className="text-sm text-muted-foreground">This content will be displayed to all employees</div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter announcement title..."
              disabled={isSaving}
              className="h-12"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Announcement Message</Label>
            <Textarea
              id="message"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder="Enter announcement message..."
              className="min-h-[150px] resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Preview */}
          <AnnouncementPreview
            type={formType}
            title={formTitle}
            message={formMessage}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !formTitle.trim() || !formMessage.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Megaphone className="h-4 w-4 mr-2" />
                Publish to All Employees
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

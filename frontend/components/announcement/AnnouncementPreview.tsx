"use client"

import { Megaphone, Lightbulb, Heart, Info, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AnnouncementPreviewProps {
  type: string
  title: string
  message: string
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

export default function AnnouncementPreview({
  type,
  title,
  message
}: AnnouncementPreviewProps) {
  const selectedType = announcementTypes.find(t => t.value === type)
  const IconComp = selectedType?.icon || Info

  return (
    <div className="space-y-2">
      <Label>Preview</Label>
      <div className={cn(
        "rounded-lg p-4 border-2 overflow-hidden relative",
        selectedType?.gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
        "text-white"
      )}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-left"></div>
        
        <div className="flex items-start gap-3 relative z-10 overflow-hidden">
          {/* Fixed icon with label */}
          <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
            <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
              <IconComp className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            <span className="text-xs text-white/80 font-medium mt-1 drop-shadow-sm">
              {selectedType?.label || 'Announcement'}
            </span>
          </div>
          
          {/* Animated text content container */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="animate-slide-left">
              <h3 className="font-semibold text-sm mb-1 text-white drop-shadow-sm">
                {title || 'Your title here...'}
              </h3>
              <p className="text-sm opacity-95 whitespace-pre-wrap text-white drop-shadow-sm">
                {message || 'Your message here...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

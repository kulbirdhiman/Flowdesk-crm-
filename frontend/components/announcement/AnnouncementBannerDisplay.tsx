"use client"

import { X, Megaphone, Lightbulb, Heart, Info, Sparkles, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnnouncementData {
  type: 'announcement' | 'thought' | 'motivation' | 'note'
  title: string
  message: string
}

interface AnnouncementBannerDisplayProps {
  announcement: AnnouncementData
  isAdmin?: boolean
  fixed?: boolean
  isSaving?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onDismiss?: () => void
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

export default function AnnouncementBannerDisplay({
  announcement,
  isAdmin = false,
  fixed = true,
  isSaving = false,
  onEdit,
  onDelete,
  onDismiss
}: AnnouncementBannerDisplayProps) {
  const typeConfig = announcementTypes.find(t => t.value === announcement.type)
  const IconComponent = typeConfig?.icon || Info

  return (
    <>
      <div className={cn(
        "w-full border-b transition-all duration-300 overflow-hidden relative rounded-b-lg",
        fixed && "fixed top-0 left-0 right-0 z-50",
        typeConfig?.gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
        "text-white"
      )}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-left"></div>
        
        <div className="w-full px-3 py-2 relative z-10 overflow-hidden">
          <div className="flex items-start gap-2">
            {/* Fixed icon with label */}
            <div className="flex-shrink-0 mt-0 flex flex-col items-center">
              <div className="p-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                <IconComponent className="h-4 w-4 text-white drop-shadow-sm" />
              </div>
              <span className="text-xs text-white/80 font-medium mt-0.5 drop-shadow-sm">
                {(() => {
                  const selectedType = announcementTypes.find(t => t.value === announcement.type);
                  return selectedType?.label || 'Announcement';
                })()}
              </span>
            </div>
            
            {/* Animated text content container */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex animate-slide-left">
                {/* First copy of content */}
                <div className="flex-shrink-0 whitespace-nowrap mr-8">
                  <h3 className="font-bold text-lg mb-0.5 text-white drop-shadow-sm inline">{announcement.title}</h3>
                  <span className="text-white drop-shadow-sm mx-3">•</span>
                  <p className="text-sm opacity-95 whitespace-pre-wrap text-white drop-shadow-sm inline">{announcement.message}</p>
                </div>
                {/* Second copy of content for continuous loop */}
                <div className="flex-shrink-0 whitespace-nowrap mr-8">
                  <h3 className="font-bold text-lg mb-0.5 text-white drop-shadow-sm inline">{announcement.title}</h3>
                  <span className="text-white drop-shadow-sm mx-3">•</span>
                  <p className="text-sm opacity-95 whitespace-pre-wrap text-white drop-shadow-sm inline">{announcement.message}</p>
                </div>
                {/* Third copy for seamless transition */}
                <div className="flex-shrink-0 whitespace-nowrap mr-8">
                  <h3 className="font-bold text-lg mb-0.5 text-white drop-shadow-sm inline">{announcement.title}</h3>
                  <span className="text-white drop-shadow-sm mx-3">•</span>
                  <p className="text-sm opacity-95 whitespace-pre-wrap text-white drop-shadow-sm inline">{announcement.message}</p>
                </div>
              </div>
            </div>
            
            {/* Fixed buttons container */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                    onClick={onEdit}
                    title="Edit announcement"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                    onClick={onDelete}
                    disabled={isSaving}
                    title="Delete announcement"
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                  </Button>
                </>
              )}
              {!isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                  onClick={onDismiss}
                  title="Dismiss"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {fixed && <div className="h-[60px]"></div>}
    </>
  )
}

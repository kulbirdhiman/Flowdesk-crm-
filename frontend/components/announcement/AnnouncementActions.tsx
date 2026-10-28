"use client"

import { X, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnnouncementActionsProps {
  isAdmin?: boolean
  isSaving?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onDismiss?: () => void
}

export default function AnnouncementActions({
  isAdmin = false,
  isSaving = false,
  onEdit,
  onDelete,
  onDismiss
}: AnnouncementActionsProps) {
  if (isAdmin) {
    return (
      <div className="flex-shrink-0 flex items-center gap-2">
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
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
        onClick={onDismiss}
        title="Dismiss"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}

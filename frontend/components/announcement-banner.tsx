"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import AnnouncementBannerDisplay from "./announcement/AnnouncementBannerDisplay"
import AnnouncementEditDialog from "./announcement/AnnouncementEditDialog"
import { AnnouncementData } from "./announcement/types"

interface AnnouncementBannerProps {
  isAdmin?: boolean
  fixed?: boolean // Control whether banner is fixed or flows with page
}

export function AnnouncementBanner({ isAdmin = false, fixed = true }: AnnouncementBannerProps) {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAnnouncement()
    const handler = () => setIsEditDialogOpen(true)
    window.addEventListener('open-announcement', handler)
    return () => window.removeEventListener('open-announcement', handler)
  }, [])

  const loadAnnouncement = async () => {
    setIsLoading(true)
    try {
      // Fetch announcement from any active employee (they all have the same announcement)
      const { data, error } = await supabase
        .from('Employee Directory')
        .select('Announcement')
        .eq('status', 'Active')
        .not('Announcement', 'is', null)
        .limit(1)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') { // Not "no rows found"
          console.error('Error loading announcement:', error)
        }
        setAnnouncement(null)
      } else if (data?.Announcement) {
        try {
          const parsed = JSON.parse(data.Announcement) as AnnouncementData
          setAnnouncement(parsed)
        } catch {
          // Invalid JSON, ignore
          setAnnouncement(null)
        }
      }
    } catch (err) {
      console.error('Error loading announcement:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Store dismissal in localStorage with timestamp
    if (announcement) {
      localStorage.setItem('dismissed-announcement', Date.now().toString())
    }
  }

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveAnnouncement = async (announcementData: AnnouncementData) => {
    setIsSaving(true)
    try {
      const announcementJson = JSON.stringify(announcementData)

      // Update ALL active employees with this announcement
      const { error } = await supabase
        .from('Employee Directory')
        .update({ Announcement: announcementJson })
        .eq('status', 'Active')

      if (error) throw error

      setAnnouncement(announcementData)
      setIsDismissed(false)
      setIsEditDialogOpen(false)
      toast.success('Announcement published to all employees!')
      
      // Clear localStorage dismissals
      localStorage.removeItem('dismissed-announcement')
    } catch (error: any) {
      console.error('Error saving announcement:', error)
      const errorMsg = error?.message || 'Unknown error'
      toast.error(`Failed to save announcement: ${errorMsg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAnnouncement = async () => {
    if (!announcement) return
    if (!confirm('Are you sure you want to delete this announcement for all employees?')) return

    setIsSaving(true)
    try {
      // Clear announcement from ALL active employees
      const { error } = await supabase
        .from('Employee Directory')
        .update({ Announcement: null })
        .eq('status', 'Active')

      if (error) throw error

      setAnnouncement(null)
      setIsDismissed(true)
      toast.success('Announcement deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting announcement:', error)
      toast.error('Failed to delete announcement')
    } finally {
      setIsSaving(false)
    }
  }

  // Check if user dismissed this announcement
  useEffect(() => {
    if (announcement) {
      const dismissedTime = localStorage.getItem('dismissed-announcement')
      if (dismissedTime) {
        const dayInMs = 24 * 60 * 60 * 1000
        const timeSinceDismissal = Date.now() - parseInt(dismissedTime)
        if (timeSinceDismissal < dayInMs) {
          setIsDismissed(true)
        } else {
          localStorage.removeItem('dismissed-announcement')
        }
      }
    }
  }, [announcement])

  if (isLoading) {
    return null
  }

  if (!announcement || isDismissed) {
    // No visible banner; keep the editor mounted for header-triggered opening
    return isAdmin ? (
      <AnnouncementEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        announcement={announcement}
        onSave={handleSaveAnnouncement}
        isSaving={isSaving}
      />
    ) : null
  }

  return (
    <>
      <AnnouncementBannerDisplay
        announcement={announcement}
        isAdmin={isAdmin}
        fixed={fixed}
        isSaving={isSaving}
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteAnnouncement}
        onDismiss={handleDismiss}
      />
      <AnnouncementEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        announcement={announcement}
        onSave={handleSaveAnnouncement}
        isSaving={isSaving}
      />
    </>
  )
}
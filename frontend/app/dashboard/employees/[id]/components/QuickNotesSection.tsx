"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote, Edit2, Save, X, Loader2 } from "lucide-react"

interface QuickNotesSectionProps {
  notesValue: string
  isEditingNotes: boolean
  isSavingNotes: boolean
  onEditNotes: () => void
  onSaveNotes: () => void
  onCancelNotes: () => void
  onNotesChange: (value: string) => void
}

export default function QuickNotesSection({
  notesValue,
  isEditingNotes,
  isSavingNotes,
  onEditNotes,
  onSaveNotes,
  onCancelNotes,
  onNotesChange
}: QuickNotesSectionProps) {
  return (
    <Card className="shadow-sm mb-4 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Quick Notes</CardTitle>
          </div>
          <div className="flex gap-2">
            {!isEditingNotes ? (
              <Button
                onClick={onEditNotes}
                variant="outline"
                size="sm"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={onCancelNotes}
                  variant="outline"
                  size="sm"
                  disabled={isSavingNotes}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={onSaveNotes}
                  size="sm"
                  disabled={isSavingNotes}
                >
                  {isSavingNotes ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditingNotes ? (
          <Textarea
            value={notesValue}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes about this employee..."
            className="min-h-[120px] resize-none"
            disabled={isSavingNotes}
          />
        ) : (
          <div className="min-h-[120px] p-3 rounded-md bg-muted/30 text-sm">
            {notesValue || (
              <span className="text-muted-foreground italic">
                No notes added yet. Click Edit to add notes.
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

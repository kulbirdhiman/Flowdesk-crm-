"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function AddDocumentModal({
  isOpen,
  onClose,
  onSave
}: AddDocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="doc-name">
              Document Name <span className="text-destructive">*</span>
            </Label>
            <Input id="doc-name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doc-type">Document Type</Label>
              <Select defaultValue="Identity & KYC Proof">
                <SelectTrigger id="doc-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Identity & KYC Proof">Identity & KYC Proof</SelectItem>
                  <SelectItem value="Employment & Company Records">Employment & Company Records</SelectItem>
                  <SelectItem value="Education & Qualification Proof">Education & Qualification Proof</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doc-status">Collection Status</Label>
              <Select defaultValue="Submitted">
                <SelectTrigger id="doc-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Not Submitted">Not Submitted</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="doc-issued-date">Issued Date</Label>
            <Input id="doc-issued-date" type="date" />
          </div>
          <div>
            <Label htmlFor="doc-attachment">Attachment</Label>
            <Input id="doc-attachment" type="file" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

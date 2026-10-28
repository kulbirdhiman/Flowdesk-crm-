"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editDocument: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    newFile?: File | null;
  };
  setEditDocument: (document: any) => void;
  categories: string[];
}

export default function EditDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  editDocument,
  setEditDocument,
  categories
}: EditDocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update document information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={editDocument.title}
              onChange={(e) => setEditDocument({ ...editDocument, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editDocument.description}
              onChange={(e) => setEditDocument({ ...editDocument, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Select value={editDocument.category} onValueChange={(value) => setEditDocument({ ...editDocument, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select value={editDocument.status} onValueChange={(value) => setEditDocument({ ...editDocument, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-file">Replace File (optional)</Label>
            <Input
              id="edit-file"
              type="file"
              onChange={(e) => setEditDocument({ ...editDocument, newFile: e.target.files?.[0] || null })}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Update Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

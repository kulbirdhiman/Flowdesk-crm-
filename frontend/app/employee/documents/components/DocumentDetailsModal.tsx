"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Image, Calendar, Download } from "lucide-react";

interface DocDetails {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  created_at: string;
  assignments?: { can_download?: boolean };
}

export default function DocumentDetailsModal({
  isOpen,
  onClose,
  doc,
  formatFileSize,
  onDownload,
}: {
  isOpen: boolean;
  onClose: () => void;
  doc: DocDetails | null;
  formatFileSize: (bytes?: number) => string;
  onDownload: (doc: DocDetails) => void;
}) {
  if (!doc) return null;

  const getIcon = (type: string) => (type?.startsWith("image/") ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>Full information for the selected document</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{doc.title}</h3>
            {doc.description && (
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{doc.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">{doc.category}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(doc.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">File Info</p>
              <div className="mt-1 flex items-center gap-3 text-sm">
                {getIcon(doc.file_type)}
                <span className="truncate max-w-[260px]" title={doc.file_name}>{doc.file_name}</span>
                <span className="text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                {doc.assignments?.can_download && (
                  <Button variant="outline" size="sm" onClick={() => onDownload(doc)}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



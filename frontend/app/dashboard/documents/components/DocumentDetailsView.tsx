"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Image, Download } from "lucide-react";

interface Employee {
  full_name: string;
  profile_photo?: string;
}

interface Assignment {
  employee?: Employee;
  can_view?: boolean;
  can_download?: boolean;
}

interface DocumentDetails {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  created_at: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  assignments?: Assignment[];
}

export default function DocumentDetailsView({
  isOpen,
  onClose,
  document,
}: {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDetails | null;
}) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => (type?.startsWith("image/") ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />);

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>Full information for the selected document</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{document.title}</h3>
            {document.description && (
              <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">{document.category}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className="mt-1">{document.status}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="mt-1 text-sm">{new Date(document.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">File Info</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                {getFileIcon(document.file_type)}
                <span className="truncate max-w-[260px]" title={document.file_name}>{document.file_name}</span>
                <span className="text-muted-foreground">{formatFileSize(document.file_size)}</span>
                <Button variant="outline" size="sm" onClick={() => window.open(document.file_url, "_blank")}> 
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Assigned To</p>
            {document.assignments && document.assignments.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {document.assignments.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={a.employee?.profile_photo || ""} />
                      <AvatarFallback>{(a.employee?.full_name || "").slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{a.employee?.full_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No assignments</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



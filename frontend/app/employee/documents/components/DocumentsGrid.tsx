"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export default function DocumentsGrid({ docs, getFileIcon, formatFileSize, onView, onDownload }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {docs.map((doc: any) => (
        <Card key={doc.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(doc.file_type)}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">{doc.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{doc.file_name}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{doc.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {doc.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{doc.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{formatFileSize(doc.file_size)}</span>
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(doc)} className="flex-1 h-8 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              {doc.assignments?.can_download && (
                <Button variant="outline" size="sm" onClick={() => onDownload(doc)} className="flex-1 h-8 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



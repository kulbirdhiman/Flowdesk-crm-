"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Users, Trash2, FileText, Image } from "lucide-react";

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  category: string;
  created_by?: {
    full_name: string;
    profile_photo?: string;
  };
  created_at: string;
  status: string;
  assignments?: {
    employee: {
      full_name: string;
      profile_photo?: string;
    };
    can_view: boolean;
    can_download: boolean;
  }[];
}

interface DocumentKanbanViewProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
  onEditDocument: (document: Document) => void;
  onAssignDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
  formatFileSize: (bytes?: number) => string;
  getFileIcon: (fileType: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

export default function DocumentKanbanView({
  documents,
  onViewDocument,
  onEditDocument,
  onAssignDocument,
  onDeleteDocument,
  formatFileSize,
  getFileIcon,
  getStatusColor
}: DocumentKanbanViewProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents.map(doc => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(doc.file_type)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {doc.file_name}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {doc.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {doc.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{doc.assignments?.length || 0} assigned</span>
                </div>
                <Badge className={`${getStatusColor(doc.status)} text-white text-xs`}>
                  {doc.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocument(doc)}
                  className="flex-1 h-7 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditDocument(doc)}
                  className="flex-1 h-7 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssignDocument(doc)}
                  className="h-7 w-7 p-0"
                  title="Assign Document"
                >
                  <Users className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteDocument(doc.id)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  title="Delete Document"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

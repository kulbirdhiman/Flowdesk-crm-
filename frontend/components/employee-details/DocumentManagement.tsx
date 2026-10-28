"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Download 
} from "lucide-react";

interface DocumentData {
  whalesync_postgres_id: string;
  employee: string;
  document_name: string;
  document_type?: string;
  collection_status: string;
  issued_date?: string;
  attachment?: string;
  created_at?: string;
}

interface DocumentManagementProps {
  documents: DocumentData[];
  activeDocTab: string;
  setActiveDocTab: (tab: string) => void;
  onAddDocument: () => void;
  onDownloadDocument: (url: string, filename: string) => void;
}

export default function DocumentManagement({
  documents,
  activeDocTab,
  setActiveDocTab,
  onAddDocument,
  onDownloadDocument
}: DocumentManagementProps) {
  const submittedDocs = documents.filter((doc) => doc.collection_status === "Submitted");
  const notSubmittedDocs = documents.filter((doc) => doc.collection_status !== "Submitted");

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Document Management</h3>
          <p className="text-sm text-muted-foreground">Manage employee documents and submissions</p>
        </div>
        <Button onClick={onAddDocument} className="h-9">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">{documents.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-foreground">{submittedDocs.length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{notSubmittedDocs.length}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Filter Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit mb-6">
        <Button
          variant={activeDocTab === "submitted" ? "default" : "ghost"}
          size="sm"
          className="h-8"
          onClick={() => setActiveDocTab("submitted")}
        >
          Submitted ({submittedDocs.length})
        </Button>
        <Button
          variant={activeDocTab === "not-submitted" ? "default" : "ghost"}
          size="sm"
          className="h-8"
          onClick={() => setActiveDocTab("not-submitted")}
        >
          Pending ({notSubmittedDocs.length})
        </Button>
      </div>

      {/* Document List */}
      {activeDocTab === "submitted" ? (
        <div className="space-y-3">
          {submittedDocs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-lg font-medium">No submitted documents</p>
                  <p className="text-sm">All documents are pending submission</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            submittedDocs.map((doc) => (
              <Card key={doc.whalesync_postgres_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.document_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_type || "General Document"} • 
                          {doc.issued_date ? new Date(doc.issued_date).toLocaleDateString() : "No date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.attachment ? (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.attachment} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDownloadDocument(doc.attachment!, doc.document_name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">No attachment</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notSubmittedDocs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">All documents submitted</p>
                  <p className="text-sm">Great job! All required documents are complete</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notSubmittedDocs.map((doc) => (
              <Card key={doc.whalesync_postgres_id} className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{doc.document_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_type || "General Document"} • Pending submission
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  );
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Download } from "lucide-react"

interface DocumentData {
  id?: number
  document_name: string
  document_type: string
  collection_status: string
  issued_date?: string
  attachment?: string
}

interface DocumentTabProps {
  submittedDocs: DocumentData[]
  notSubmittedDocs: DocumentData[]
  activeDocTab: string
  onDocTabChange: (value: string) => void
  onAddDocument: () => void
}

export default function DocumentTab({
  submittedDocs,
  notSubmittedDocs,
  activeDocTab,
  onDocTabChange,
  onAddDocument
}: DocumentTabProps) {
  return (
    <div className="mt-0 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Documents</h3>
        <Button onClick={onAddDocument} size="sm">
          Add Document
        </Button>
      </div>

      <Tabs value={activeDocTab} onValueChange={onDocTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="not-submitted">Not Submitted</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No submitted documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  submittedDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.document_name}</TableCell>
                      <TableCell>{doc.document_type}</TableCell>
                      <TableCell>
                        {doc.issued_date ? new Date(doc.issued_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {doc.attachment ? (
                            <>
                              <Button variant="link" size="sm" asChild>
                                <a href={doc.attachment} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={doc.attachment} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="not-submitted" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notSubmittedDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No pending documents.
                    </TableCell>
                  </TableRow>
                ) : (
                  notSubmittedDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.document_name}</TableCell>
                      <TableCell>{doc.document_type}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

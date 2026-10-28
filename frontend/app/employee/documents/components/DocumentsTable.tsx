"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye } from "lucide-react";

export default function DocumentsTable({
  docs,
  visibleColumns,
  handleSort,
  getSortIcon,
  getFileIcon,
  formatFileSize,
  onView,
  onDownload,
}: any) {
  return (
    <div className="w-full rounded-md border overflow-hidden flex-1 min-h-0 flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="hover:bg-transparent">
              {visibleColumns.document && (
                <TableHead className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("title")}>
                  Document{getSortIcon("title")}
                </TableHead>
              )}
              {visibleColumns.category && (
                <TableHead className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("category")}>
                  Category{getSortIcon("category")}
                </TableHead>
              )}
              {visibleColumns.fileInfo && (
                <TableHead className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("file_name")}>
                  File Info{getSortIcon("file_name")}
                </TableHead>
              )}
              {visibleColumns.created && (
                <TableHead className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("created_at")}>
                  Created{getSortIcon("created_at")}
                </TableHead>
              )}
              {visibleColumns.actions && <TableHead className="h-10 px-3 text-sm font-semibold bg-background">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">No documents found.</TableCell>
              </TableRow>
            ) : (
              docs.map((doc: any) => (
                <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(doc)}>
                  {visibleColumns.document && (
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div>
                          <p className="font-bold text-sm">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.description || "No description"}</p>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.category && (
                    <TableCell className="px-3 py-3">
                      <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                    </TableCell>
                  )}
                  {visibleColumns.fileInfo && (
                    <TableCell className="px-3 py-3">
                      <div className="text-sm">
                        <p className="font-medium">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</p>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.created && (
                    <TableCell className="px-3 py-3 text-sm">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onView(doc); }} className="h-8 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {doc.assignments?.can_download && (
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onDownload(doc); }} className="h-8 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}



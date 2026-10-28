"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Users, Trash2, ArrowUpDown, ArrowUp, ArrowDown, FileText, Image } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface DocumentTableViewProps {
  documents: Document[];
  visibleColumns: {
    document: boolean;
    category: boolean;
    fileInfo: boolean;
    assignedTo: boolean;
    status: boolean;
    created: boolean;
    actions: boolean;
  };
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewDocument: (document: Document) => void;
  onEditDocument: (document: Document) => void;
  onAssignDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
  formatFileSize: (bytes?: number) => string;
  getFileIcon: (fileType: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  onRowClick?: (document: Document) => void;
}

export default function DocumentTableView({
  documents,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onViewDocument,
  onEditDocument,
  onAssignDocument,
  onDeleteDocument,
  formatFileSize,
  getFileIcon,
  getStatusColor,
  onRowClick
}: DocumentTableViewProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : 
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />;
  };

  return (
    <div className="w-full rounded-md border overflow-hidden">
      <Table className="table-fixed w-full">
        <colgroup>
          <col className="w-[200px]" />
          <col className="w-[120px]" />
          <col className="w-[180px]" />
          <col className="w-[120px]" />
          <col className="w-[100px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
        </colgroup>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {visibleColumns.document && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("title")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Document
                  {getSortIcon("title")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.category && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("category")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Category
                  {getSortIcon("category")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.fileInfo && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("file_name")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  File Info
                  {getSortIcon("file_name")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.assignedTo && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("assignments")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Assigned To
                  {getSortIcon("assignments")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.status && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("status")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.created && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                <Button
                  variant="ghost"
                  onClick={() => onSort("created_at")}
                  className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                >
                  Created
                  {getSortIcon("created_at")}
                </Button>
              </TableHead>
            )}
            {visibleColumns.actions && (
              <TableHead className="text-xs font-semibold text-foreground px-3 py-3">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map(doc => (
              <TableRow 
                key={doc.id} 
                className="border-b border-border hover:bg-muted/30 transition-colors"
                onClick={() => onRowClick && onRowClick(doc)}
              >
                {visibleColumns.document && (
                  <TableCell className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.file_type)}
                      <div>
                        <div className="font-semibold text-sm">{doc.title}</div>
                        <div className="text-xs text-muted-foreground truncate" title={doc.description || "No description"}>
                          {doc.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.category && (
                  <TableCell className="py-3 px-3">
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.fileInfo && (
                  <TableCell className="py-3 px-3">
                    <div className="text-sm">
                      <div className="font-medium truncate" title={doc.file_name}>{doc.file_name}</div>
                      <div className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.assignedTo && (
                  <TableCell className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{doc.assignments?.length || 0} employees</span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell className="py-3 px-3">
                    <Badge className={`${getStatusColor(doc.status)} text-white text-xs`}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.created && (
                  <TableCell className="py-3 px-3">
                    <div className="text-sm">{new Date(doc.created_at).toLocaleDateString()}</div>
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); onViewDocument(doc); }}
                              className="h-7 w-7 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white">
                            <p>View</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); onEditDocument(doc); }}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white">
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); onAssignDocument(doc); }}
                              className="h-7 w-7 p-0"
                            >
                              <Users className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white">
                            <p>Assign</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white">
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-16">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">No Documents Found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your filters or resetting the view.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

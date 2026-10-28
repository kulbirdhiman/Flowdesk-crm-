"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Image, 
  Download, 
  Eye, 
  Search,
  Filter,
  Calendar,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  List,
  Settings,
  Check,
  X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import DocumentsActionBar from "./components/DocumentsActionBar";
import DocumentsGrid from "./components/DocumentsGrid";
import DocumentsTable from "./components/DocumentsTable";
import DocumentsPagination from "./components/DocumentsPagination";
import DocumentDetailsModal from "./components/DocumentDetailsModal";

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
  assignments?: {
    can_view: boolean;
    can_download: boolean;
  };
}

export default function EmployeeDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [showKanban, setShowKanban] = useState(true);
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    document: true,
    category: true,
    fileInfo: true,
    created: true,
    actions: true
  });
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const categories = ["General", "HR", "Finance", "Marketing", "Sales", "Technical", "Legal", "Other"];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // First, get the employee's whalesync_postgres_id from Employee Directory
      const { data: employeeData, error: employeeError } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id")
        .eq("official_email", user.email)
        .single();

      if (employeeError || !employeeData) {
        console.error("Employee lookup error:", employeeError);
        toast.error("Employee profile not found");
        setDocuments([]);
        return;
      }

      // Get document assignments for the employee using their whalesync_postgres_id
      const { data: assignments, error: assignmentsError } = await supabase
        .from("document_assignments")
        .select("document_id, can_view, can_download")
        .eq("employee_id", employeeData.whalesync_postgres_id);

      if (assignmentsError) {
        console.error("Assignments error:", assignmentsError);
        setDocuments([]);
        return;
      }

      if (!assignments || assignments.length === 0) {
        setDocuments([]);
        return;
      }

      // Then get the documents
      const documentIds = assignments.map(a => a.document_id);
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("*")
        .in("id", documentIds)
        .eq("status", "Active")
        .order("created_at", { ascending: false });

      if (documentsError) {
        console.error("Documents error:", documentsError);
        throw documentsError;
      }

      // Combine the data
      const combinedData = documentsData?.map(doc => ({
        ...doc,
        assignments: assignments.find(a => a.document_id === doc.id)
      })) || [];

      setDocuments(combinedData);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(doc.category);
    return matchesSearch && matchesCategory;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "title":
        aValue = a.title?.toLowerCase() || "";
        bValue = b.title?.toLowerCase() || "";
        break;
      case "category":
        aValue = a.category?.toLowerCase() || "";
        bValue = b.category?.toLowerCase() || "";
        break;
      case "file_name":
        aValue = a.file_name?.toLowerCase() || "";
        bValue = b.file_name?.toLowerCase() || "";
        break;
      case "created_at":
        aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
        bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalCount = sortedDocuments.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedDocuments = sortedDocuments.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // Reset to first page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, categoryFilter]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleDownload = async (doc: Document) => {
    try {
      if (!doc.assignments?.can_download) {
        toast.error("You don't have permission to download this document");
        return;
      }

      const response = await fetch(doc.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = (doc: Document) => {
    if (!doc.assignments?.can_view) {
      toast.error("You don't have permission to view this document");
      return;
    }
    setSelectedDoc(doc);
    setIsDetailsOpen(true);
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const resetColumns = () => {
    setVisibleColumns({
      document: true,
      category: true,
      fileInfo: true,
      created: true,
      actions: true
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-3 w-3 inline" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-1 h-3 w-3 inline" />;
    }
    return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden flex-1">
        <DocumentsActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          showKanban={showKanban}
          setShowKanban={setShowKanban}
          showColumnPopover={showColumnPopover}
          setShowColumnPopover={setShowColumnPopover}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          resetColumns={resetColumns}
        />

        {/* Documents Grid/Table - Scrollable */}
        <div className="flex-1 overflow-hidden px-4">
          <div className="h-full overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading documents...</div>
              </div>
            ) : paginatedDocuments.length > 0 ? (
              showKanban ? (
                <DocumentsGrid
                  docs={paginatedDocuments}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ) : (
                <DocumentsTable
                  docs={paginatedDocuments}
                  visibleColumns={visibleColumns}
                  handleSort={handleSort}
                  getSortIcon={getSortIcon}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents found</p>
                  <p className="text-sm text-muted-foreground">
                    Documents assigned to you will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination - Fixed at Bottom */}
        {paginatedDocuments.length > 0 && (
          <DocumentsPagination
            totalCount={totalCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPageIndex={setPageIndex}
            totalPages={totalPages}
          />
        )}
      </div>

      <DocumentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedDoc(null); }}
        doc={selectedDoc as any}
        formatFileSize={formatFileSize}
        onDownload={handleDownload as any}
      />
    </div>
  );
}

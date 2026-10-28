"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import DocumentFilters from "./components/DocumentFilters";
import DocumentTableView from "./components/DocumentTableView";
import DocumentKanbanView from "./components/DocumentKanbanView";
import DocumentPagination from "./components/DocumentPagination";
import CreateDocumentModal from "./components/CreateDocumentModal";
import EditDocumentModal from "./components/EditDocumentModal";
import AssignDocumentModal from "./components/AssignDocumentModal";
import DocumentDetailsView from "./components/DocumentDetailsView";

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

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedEmployeesForAssign, setSelectedEmployeesForAssign] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [showKanban, setShowKanban] = useState(false);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState({
    document: true,
    category: true,
    fileInfo: true,
    assignedTo: true,
    status: true,
    created: true,
    actions: true
  });

  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    category: "General",
    file: null as File | null,
    selectedEmployees: [] as string[]
  });

  const [editDocument, setEditDocument] = useState({
    id: "",
    title: "",
    description: "",
    category: "General",
    status: "Active",
    newFile: null as File | null
  });

  const categories = ["General", "HR", "Finance", "Marketing", "Sales", "Technical", "Legal", "Other"];

  useEffect(() => {
    loadDocuments();
    loadEmployees();
  }, []);

  // Initialize selected employees when dialog opens
  useEffect(() => {
    if (isAssignDialogOpen && selectedDocument) {
      const currentAssignments = selectedDocument.assignments?.map(a => a.employee?.whalesync_postgres_id).filter(Boolean) || [];
      setSelectedEmployeesForAssign(currentAssignments);
    }
  }, [isAssignDialogOpen, selectedDocument]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      console.log("Loading documents...");
      
      // Get documents with simple query first
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Documents query result:", { documentsData, documentsError });

      if (documentsError) {
        console.error("Documents error:", documentsError);
        throw documentsError;
      }

      if (!documentsData || documentsData.length === 0) {
        console.log("No documents found");
        setDocuments([]);
        return;
      }

      // Get assignments separately
      const documentIds = documentsData.map(doc => doc.id);
      console.log("Document IDs:", documentIds);
      
      let assignmentsData = [];
      
      if (documentIds.length > 0) {
        const { data: assignments, error: assignmentsError } = await supabase
          .from("document_assignments")
          .select("document_id, can_view, can_download, employee_id")
          .in("document_id", documentIds);

        console.log("Assignments query result:", { assignments, assignmentsError });

        if (assignmentsError) {
          console.error("Assignments error:", assignmentsError);
          // Don't throw here, just continue without assignments
        } else {
          assignmentsData = assignments || [];
        }
      }

      // Get employee info for assignments
      const employeeIds = [...new Set(assignmentsData.map(a => a.employee_id).filter(Boolean))];
      let employeesData = [];
      
      if (employeeIds.length > 0) {
        const { data: employees, error: employeesError } = await supabase
          .from("Employee Directory")
          .select("whalesync_postgres_id, full_name, profile_photo")
          .in("whalesync_postgres_id", employeeIds);

        console.log("Employees query result:", { employees, employeesError });

        if (employeesError) {
          console.error("Employees error:", employeesError);
        } else {
          employeesData = employees || [];
        }
      }

      // Get creator information
      const creatorIds = [...new Set(documentsData.map(doc => doc.created_by).filter(Boolean))];
      let creatorsData = [];
      
      if (creatorIds.length > 0) {
        const { data: creators, error: creatorsError } = await supabase
          .from("Employee Directory")
          .select("whalesync_postgres_id, full_name, profile_photo")
          .in("whalesync_postgres_id", creatorIds);

        console.log("Creators query result:", { creators, creatorsError });

        if (creatorsError) {
          console.error("Creators error:", creatorsError);
        } else {
          creatorsData = creators || [];
        }
      }

      // Combine the data
      const combinedData = documentsData.map(doc => ({
        ...doc,
        created_by: creatorsData.find(creator => creator.whalesync_postgres_id === doc.created_by),
        assignments: assignmentsData
          .filter(assignment => assignment.document_id === doc.id)
          .map(assignment => ({
            ...assignment,
            employee: employeesData.find(emp => emp.whalesync_postgres_id === assignment.employee_id)
          }))
      }));

      console.log("Combined data:", combinedData);
      setDocuments(combinedData);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo")
        .eq("status", "Active");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast.error("Failed to load employees");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleCreateDocument = async () => {
    try {
      if (!newDocument.file) {
        toast.error("Please select a file to upload");
        return;
      }

      const fileUrl = await handleFileUpload(newDocument.file);
      
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: newDocument.title,
          description: newDocument.description,
          file_name: newDocument.file.name,
          file_type: newDocument.file.type,
          file_size: newDocument.file.size,
          file_url: fileUrl,
          category: newDocument.category
        })
        .select()
        .single();

      if (error) throw error;

      // Assign to selected employees
      if (newDocument.selectedEmployees.length > 0) {
        const assignments = newDocument.selectedEmployees.map(employeeId => ({
          document_id: data.id,
          employee_id: employeeId
        }));

        const { error: assignError } = await supabase
          .from("document_assignments")
          .insert(assignments);

        if (assignError) throw assignError;
      }

      toast.success("Document created successfully");
      setIsCreateDialogOpen(false);
      setNewDocument({
        title: "",
        description: "",
        category: "General",
        file: null,
        selectedEmployees: []
      });
      loadDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document");
    }
  };

  const handleUpdateDocument = async () => {
    try {
      let fileUpdate: any = {};
      if (editDocument.newFile) {
        const file = editDocument.newFile;
        const fileUrl = await handleFileUpload(file);
        fileUpdate = {
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: fileUrl
        };
      }

      const { error } = await supabase
        .from("documents")
        .update({
          title: editDocument.title,
          description: editDocument.description,
          category: editDocument.category,
          status: editDocument.status,
          ...fileUpdate
        })
        .eq("id", editDocument.id);

      if (error) throw error;

      toast.success("Document updated successfully");
      setIsEditDialogOpen(false);
      setEditDocument(prev => ({ ...prev, newFile: null }));
      loadDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Document deleted successfully");
      loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleAssignDocument = async () => {
    if (!selectedDocument) return;

    try {
      // Remove existing assignments
      await supabase
        .from("document_assignments")
        .delete()
        .eq("document_id", selectedDocument.id);

      // Add new assignments
      if (selectedEmployeesForAssign.length > 0) {
        const assignments = selectedEmployeesForAssign.map(employeeId => ({
          document_id: selectedDocument.id,
          employee_id: employeeId,
          can_view: true,
          can_download: true
        }));

        const { error } = await supabase
          .from("document_assignments")
          .insert(assignments);

        if (error) throw error;
      }

      toast.success("Document assignments updated successfully");
      setIsAssignDialogOpen(false);
      setSelectedDocument(null);
      setSelectedEmployeesForAssign([]);
      loadDocuments();
    } catch (error) {
      console.error("Error assigning document:", error);
      toast.error("Failed to assign document");
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(doc.category);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(doc.status);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];

      // Handle different data types
      if (sortField === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Pagination logic
  const totalCount = filteredDocuments.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedDocuments = filteredDocuments.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // Reset to first page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, categoryFilter, statusFilter]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Archived": return "bg-yellow-500";
      case "Deleted": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDocument = (document: Document) => {
    // Keep action button behavior (open file)
    window.open(document.file_url, '_blank');
  };

  const handleRowClick = (document: Document) => {
    setSelectedDocument(document);
    setIsDetailsOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditDocument({
      id: document.id,
      title: document.title,
      description: document.description || "",
      category: document.category,
      status: document.status,
      newFile: null
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsAssignDialogOpen(true);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader title="Documents" />
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg text-muted-foreground">Loading documents...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header - Fixed */}
          <SiteHeader title="Documents" />

          {/* Main Content */}
          <div className="flex flex-col overflow-hidden flex-1">
            {/* Action Bar - Fixed */}
            <DocumentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showKanban={showKanban}
              setShowKanban={setShowKanban}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              onAddDocument={() => setIsCreateDialogOpen(true)}
              categories={categories}
            />

            {/* Table or Kanban Container - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 min-h-0">
              {showKanban ? (
                <DocumentKanbanView
                  documents={paginatedDocuments}
                  onViewDocument={handleViewDocument}
                  onEditDocument={handleEditDocument}
                  onAssignDocument={handleAssignDocumentClick}
                  onDeleteDocument={handleDeleteDocument}
                  formatFileSize={formatFileSize}
                  getFileIcon={getFileIcon}
                  getStatusColor={getStatusColor}
                />
              ) : (
                <DocumentTableView
                  documents={paginatedDocuments}
                  visibleColumns={visibleColumns}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onViewDocument={handleViewDocument}
                  onEditDocument={handleEditDocument}
                  onAssignDocument={handleAssignDocumentClick}
                  onDeleteDocument={handleDeleteDocument}
                  formatFileSize={formatFileSize}
                  getFileIcon={getFileIcon}
                  getStatusColor={getStatusColor}
                  onRowClick={handleRowClick}
                />
              )}
            </div>

            {/* Pagination - Fixed at Bottom */}
            <DocumentPagination
              totalCount={totalCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setPageIndex}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageIndex(0);
              }}
            />
          </div>
        </div>

        {/* Create Document Dialog */}
        <CreateDocumentModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateDocument}
          newDocument={newDocument}
          setNewDocument={setNewDocument}
          employees={employees}
          categories={categories}
        />

        {/* Edit Document Dialog */}
        <EditDocumentModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleUpdateDocument}
          editDocument={editDocument}
          setEditDocument={setEditDocument}
          categories={categories}
        />

        {/* Assign Document Dialog */}
        <AssignDocumentModal
          isOpen={isAssignDialogOpen}
          onClose={() => {
            setIsAssignDialogOpen(false);
            setSelectedDocument(null);
            setSelectedEmployeesForAssign([]);
          }}
          onSubmit={handleAssignDocument}
          selectedDocument={selectedDocument}
          selectedEmployees={selectedEmployeesForAssign}
          setSelectedEmployees={setSelectedEmployeesForAssign}
          employees={employees}
        />
      </SidebarInset>

      {/* Document Details View */}
      <DocumentDetailsView
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedDocument(null); }}
        document={selectedDocument as any}
      />
    </SidebarProvider>
  );
}
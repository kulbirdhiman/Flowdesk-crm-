"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import TicketStatisticsCards from "./components/TicketStatisticsCards";
import TicketFilters from "./components/TicketFilters";
import TicketTableView from "./components/TicketTableView";
import TicketKanbanView from "./components/TicketKanbanView";
import TicketListView from "./components/TicketListView";
import CreateTicketModal from "./components/CreateTicketModal";
import TicketDetailsModal from "./components/TicketDetailsModal";
import ShareTicketModal from "./components/ShareTicketModal";

interface Ticket {
  id: string;
  ticket_number: number;
  client_name: string;
  client_email: string;
  company: string;
  issue: string;
  status: 'New' | 'In Progress' | 'Escalated' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assigned_to: string;
  created_at: string;
  updated_at: string;
  history?: TicketHistory[];
  chat?: TicketChat[];
}

interface TicketHistory {
  id: string;
  user_name: string;
  action: string;
  created_at: string;
}

interface TicketChat {
  id: string;
  user_name: string;
  message: string;
  sender_type: 'sent' | 'received';
  created_at: string;
}

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
  job_title?: string;
}

export default function EmployeeTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'kanban'>('table');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0
  });
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    ticket: true,
    company: true,
    client: true,
    status: true,
    priority: true,
    created: true,
    actions: true
  });
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [newTicket, setNewTicket] = useState({
    client_name: "",
    client_email: "",
    company: "",
    issue: "",
    priority: "Medium"
  });

  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadEmployees();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTickets();
    }
  }, [currentUser, statusFilter, priorityFilter, timeFilter]);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Get employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name")
        .eq("official_email", user.email)
        .single();

      if (employeeError || !employeeData) {
        console.error("Employee lookup error:", employeeError);
        toast.error("Employee profile not found");
        return;
      }

      setCurrentUser(employeeData);
    } catch (error) {
      console.error("Error loading user:", error);
      toast.error("Failed to load user data");
    }
  };

  const loadTickets = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // 1) Tickets directly assigned (legacy string field)
      let directQuery = supabase
        .from("tickets")
        .select("*")
        .eq("assigned_to", currentUser.full_name);
      if (statusFilter.length > 0) directQuery = directQuery.in("status", statusFilter);
      if (priorityFilter.length > 0) directQuery = directQuery.in("priority", priorityFilter);
      const { data: directTickets, error: directError } = await directQuery.order("created_at", { ascending: false });
      if (directError) throw directError;

      // 2) Tickets assigned via pivot table ticket_assignments (recommended path)
      const { data: assignments, error: assignError } = await supabase
        .from("ticket_assignments")
        .select("ticket_id")
        .eq("employee_id", currentUser.whalesync_postgres_id);
      if (assignError) throw assignError;

      let viaAssignments: any[] = [];
      if (assignments && assignments.length > 0) {
        const ticketIds = assignments.map(a => a.ticket_id).filter(Boolean);
        if (ticketIds.length > 0) {
          let pivotQuery = supabase
            .from("tickets")
            .select("*")
            .in("id", ticketIds);
          if (statusFilter.length > 0) pivotQuery = pivotQuery.in("status", statusFilter);
          if (priorityFilter.length > 0) pivotQuery = pivotQuery.in("priority", priorityFilter);
          const { data: pivotTickets, error: pivotError } = await pivotQuery.order("created_at", { ascending: false });
          if (pivotError) throw pivotError;
          viaAssignments = pivotTickets || [];
        }
      }

      // Merge and de-duplicate by id
      const byId: Record<string, any> = {};
      for (const t of directTickets || []) byId[t.id] = t;
      for (const t of viaAssignments || []) byId[t.id] = t;

      // Convert to array
      let mergedTickets = Object.values(byId);

      // Apply date filter in JavaScript if needed
      let filteredTickets = mergedTickets || [];
      if (timeFilter.length > 0) {
        const now = new Date();
        filteredTickets = filteredTickets.filter(ticket => {
          const ticketDate = new Date(ticket.created_at);
          return timeFilter.some(filter => {
            switch (filter) {
              case "yesterday":
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                return ticketDate.toDateString() === yesterday.toDateString();
              case "7days":
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return ticketDate >= weekAgo;
              case "2weeks":
                const twoWeeksAgo = new Date(now);
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                return ticketDate >= twoWeeksAgo;
              case "thismonth":
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return ticketDate >= startOfMonth;
              default:
                return true;
            }
          });
        });
      }

      // Sort newest first
      filteredTickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTickets(filteredTickets);

      // Calculate stats
      const total = filteredTickets.length;
      const newCount = filteredTickets.filter(t => t.status === 'New').length;
      const inProgressCount = filteredTickets.filter(t => t.status === 'In Progress').length;
      const escalatedCount = filteredTickets.filter(t => t.status === 'Escalated').length;
      const resolvedCount = filteredTickets.filter(t => t.status === 'Resolved').length;

      setStats({
        total,
        new: newCount,
        inProgress: inProgressCount,
        escalated: escalatedCount,
        resolved: resolvedCount
      });

    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      console.log("Loading employees...");
      const { data: employeesData, error: employeesError } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo, job_title")
        .order("full_name");

      if (employeesError) {
        console.error("Employees error:", employeesError);
        throw employeesError;
      }

      setEmployees(employeesData || []);
      console.log("Loaded employees:", employeesData?.length || 0);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast.error("Failed to load employees");
    }
  };

  const handleShareTicket = async () => {
    if (!selectedTicket || selectedEmployees.length === 0) return;

    try {
      // Create shared tickets for each selected employee
      const sharedTickets = selectedEmployees.map(employeeId => {
        const employee = employees.find(emp => emp.whalesync_postgres_id === employeeId);
        return {
          ticket_number: selectedTicket.ticket_number,
          client_name: selectedTicket.client_name,
          client_email: selectedTicket.client_email,
          company: selectedTicket.company,
          issue: selectedTicket.issue,
          status: selectedTicket.status,
          priority: selectedTicket.priority,
          assigned_to: employee?.full_name || 'Unknown',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_ticket_id: selectedTicket.id
        };
      });

      const { error } = await supabase
        .from("tickets")
        .insert(sharedTickets);

      if (error) throw error;

      toast.success(`Ticket shared with ${selectedEmployees.length} employee(s)`);
      setIsShareDialogOpen(false);
      setSelectedEmployees([]);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error sharing ticket:", error);
      toast.error("Failed to share ticket");
    }
  };

  const toggleSelectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.whalesync_postgres_id));
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleCreateTicket = async () => {
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    if (!newTicket.client_name || !newTicket.client_email || !newTicket.company || !newTicket.issue) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tickets")
        .insert([{
          ticket_number: Math.floor(Math.random() * 900000) + 100000,
          client_name: newTicket.client_name,
          client_email: newTicket.client_email,
          company: newTicket.company,
          issue: newTicket.issue,
          status: "New",
          priority: newTicket.priority,
          assigned_to: currentUser.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setTickets(prevTickets => [data, ...prevTickets]);

      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        new: prev.new + 1
      }));

      setIsCreateDialogOpen(false);
      setNewTicket({
        client_name: "",
        client_email: "",
        company: "",
        issue: "",
        priority: "Medium"
      });
      toast.success("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  const handleSendChat = async () => {
    if (!selectedTicket || !chatMessage.trim()) return;

    try {
      const { error } = await supabase
        .from("ticket_chat")
        .insert([{
          ticket_id: selectedTicket.id,
          user_name: currentUser?.full_name || 'Unknown',
          message: chatMessage.trim(),
          sender_type: 'sent',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Update local state
      setSelectedTicket(prev => prev ? {
        ...prev,
        chat: [...(prev.chat || []), {
          id: Date.now().toString(),
          user_name: currentUser?.full_name || 'Unknown',
          message: chatMessage.trim(),
          sender_type: 'sent' as const,
          created_at: new Date().toISOString()
        }]
      } : null);

      setChatMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending chat:", error);
      toast.error("Failed to send message");
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn as keyof Ticket];
    const bValue = b[sortColumn as keyof Ticket];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCount = sortedTickets.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedTickets = sortedTickets.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev]
    }));
  };

  const resetColumns = () => {
    setVisibleColumns({
      ticket: true,
      company: true,
      client: true,
      status: true,
      priority: true,
      created: true,
      actions: true
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setPriorityFilter([]);
    setTimeFilter([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (ticketError) throw ticketError;

      // Load chat messages
      const { data: chatData, error: chatError } = await supabase
        .from("ticket_chat")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (chatError) {
        console.error("Chat error:", chatError);
      }

      // Load ticket history
      const { data: historyData, error: historyError } = await supabase
        .from("ticket_history")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (historyError) {
        console.error("History error:", historyError);
      }

      setSelectedTicket({
        ...ticketData,
        chat: chatData || [],
        history: historyData || []
      });
    } catch (error) {
      console.error("Error loading ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };

  // Helper to load details and open the details dialog
  const openTicketDetails = async (ticketId: string) => {
    await loadTicketDetails(ticketId);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", ticketId);

      if (error) throw error;

      // Add to history
      await supabase
        .from("ticket_history")
        .insert([{
          ticket_id: ticketId,
          user_name: currentUser?.full_name || 'Unknown',
          action: `Status changed to ${newStatus}`,
          created_at: new Date().toISOString()
        }]);

      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: newStatus as any, updated_at: new Date().toISOString() } : ticket
        )
      );

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any, updated_at: new Date().toISOString() } : null);
      }

      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleUpdateTicket = async (ticketId: string, updatedData: Partial<Ticket>) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update(updatedData)
        .eq("id", ticketId);

      if (error) throw error;

      // Add to history
      await supabase
        .from("ticket_history")
        .insert([{
          ticket_id: ticketId,
          user_name: currentUser?.full_name || 'Unknown',
          action: 'Ticket details updated',
          created_at: new Date().toISOString()
        }]);

      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, ...updatedData } : ticket
        )
      );

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, ...updatedData } : null);
      }

      toast.success("Ticket updated successfully!");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const { error } = await supabase
        .from("tickets")
        .delete()
        .eq("id", ticketId);

      if (error) throw error;

      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      toast.success("Ticket deleted successfully");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find(t => t.id === event.active.id);
    setActiveTicket(ticket || null);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);
    setIsDragging(false);

    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as string;

    if (newStatus && newStatus !== 'New' && newStatus !== 'In Progress' && newStatus !== 'Escalated' && newStatus !== 'Resolved') {
      return;
    }

    handleUpdateTicketStatus(ticketId, newStatus);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden flex-1">
        {/* Stats Cards */}
        <TicketStatisticsCards stats={stats} />

        {/* Action Bar */}
        <TicketFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          showColumnPopover={showColumnPopover}
          setShowColumnPopover={setShowColumnPopover}
          clearAllFilters={clearAllFilters}
          toggleColumn={toggleColumn}
          resetColumns={resetColumns}
          onCreateTicket={() => setIsCreateDialogOpen(true)}
        />

        {/* Tickets List */}
        <div className="flex-1 overflow-hidden px-4">
          <div className="h-full overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading tickets...</div>
              </div>
            ) : paginatedTickets.length > 0 ? (
              viewMode === 'kanban' ? (
                <TicketKanbanView
                  tickets={filteredTickets}
                  loading={loading}
                  activeTicket={activeTicket}
                  isDragging={isDragging}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onViewTicket={openTicketDetails}
                  formatDate={formatDate}
                />
              ) : viewMode === 'list' ? (
                <TicketListView
                  tickets={paginatedTickets}
                  loading={loading}
                  onViewTicket={openTicketDetails}
                  formatDate={formatDate}
                />
              ) : (
                <TicketTableView
                  tickets={paginatedTickets}
                  loading={loading}
                  visibleColumns={visibleColumns}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onViewTicket={openTicketDetails}
                  onShareTicket={(ticket) => {
                    setSelectedTicket(ticket);
                    setSelectedEmployees([]);
                    setIsShareDialogOpen(true);
                  }}
                  onEditTicket={openTicketDetails}
                  onDeleteTicket={handleDeleteTicket}
                  formatDate={formatDate}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assigned tickets found</p>
                  <p className="text-sm text-muted-foreground mt-2">Tickets assigned to you by admin will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {paginatedTickets.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t border-border bg-muted/20 px-4 flex-shrink-0">
            <div className="text-sm text-muted-foreground">
              Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} tickets
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex(0)}
                className="h-9"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                className="h-9"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(pageIndex + 1) * pageSize >= totalCount}
                onClick={() => setPageIndex((prev) => prev + 1)}
                className="h-9"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(pageIndex + 1) * pageSize >= totalCount}
                onClick={() => setPageIndex(totalPages - 1)}
                className="h-9"
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        onCreateTicket={handleCreateTicket}
      />

      <TicketDetailsModal
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        selectedTicket={selectedTicket}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        onSendChat={handleSendChat}
        onUpdateTicket={handleUpdateTicket}
        formatDate={formatDate}
      />

      <ShareTicketModal
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        selectedTicket={selectedTicket}
        employees={employees}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        onShareTicket={handleShareTicket}
        onToggleSelectAll={toggleSelectAllEmployees}
        onToggleEmployeeSelection={toggleEmployeeSelection}
      />
    </div>
  );
}
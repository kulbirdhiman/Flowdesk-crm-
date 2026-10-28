"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import TicketStatisticsCards from "./components/TicketStatisticsCards";
import TicketFilters from "./components/TicketFilters";
import TicketTableView from "./components/TicketTableView";
import TicketKanbanView from "./components/TicketKanbanView";
import CreateTicketModal from "./components/CreateTicketModal";
import TicketDetailsModal from "./components/TicketDetailsModal";
import AssignTicketModal from "./components/AssignTicketModal";
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


export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    ticketNumber: true,
    company: true,
    client: true,
    issue: true,
    status: true,
    priority: true,
    assignedTo: true,
    created: true,
    actions: true
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(20);
  const [showKanban, setShowKanban] = useState(false);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0
  });

  const [newTicket, setNewTicket] = useState({
    client_name: "",
    client_email: "",
    company: "",
    issue: "",
    priority: "Medium"
  });

  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    loadTickets();
    loadEmployees();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      
      const { data: ticketsData, error: ticketsError } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketsError) {
        console.error("Tickets error:", ticketsError);
        throw ticketsError;
      }

      setTickets(ticketsData || []);

      // Calculate stats
      const total = ticketsData?.length || 0;
      const newCount = ticketsData?.filter(t => t.status === 'New').length || 0;
      const inProgressCount = ticketsData?.filter(t => t.status === 'In Progress').length || 0;
      const escalatedCount = ticketsData?.filter(t => t.status === 'Escalated').length || 0;
      const resolvedCount = ticketsData?.filter(t => t.status === 'Resolved').length || 0;

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
      const { data, error } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo, job_title")
        .order("full_name");

      if (error) {
        console.error("Error loading employees:", error);
        return;
      }

      console.log("Employees loaded:", data);
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (ticketError) throw ticketError;

      // Load ticket history
      const { data: historyData } = await supabase
        .from("ticket_history")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: false });

      // Load ticket chat
      const { data: chatData } = await supabase
        .from("ticket_chat")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      setSelectedTicket({
        ...ticketData,
        history: historyData || [],
        chat: chatData || []
      });
    } catch (error) {
      console.error("Error loading ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };

  const handleCreateTicket = async () => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          client_name: newTicket.client_name,
          client_email: newTicket.client_email,
          company: newTicket.company,
          issue: newTicket.issue,
          priority: newTicket.priority,
          status: 'New',
          assigned_to: 'Operations'
        })
        .select()
        .single();

      if (error) throw error;

      // Add to history
      await supabase
        .from("ticket_history")
        .insert({
          ticket_id: data.id,
          user_name: "Admin",
          action: "Ticket created via Admin Portal."
        });

      toast.success(`New Ticket #${data.ticket_number} created!`);
      setIsCreateDialogOpen(false);
      setNewTicket({
        client_name: "",
        client_email: "",
        company: "",
        issue: "",
        priority: "Medium"
      });
      loadTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
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
          user_name: "Admin",
          action: `Status changed to ${newStatus}`,
          created_at: new Date().toISOString()
        }]);

      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: newStatus as Ticket['status'], updated_at: new Date().toISOString() } : ticket
        )
      );

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus as Ticket['status'], updated_at: new Date().toISOString() } : null);
      }

      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleSendChat = async () => {
    if (!selectedTicket || !chatMessage.trim()) return;

    try {
      const { error } = await supabase
        .from("ticket_chat")
        .insert({
          ticket_id: selectedTicket.id,
          user_name: "Admin",
          message: chatMessage,
          sender_type: "sent",
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setChatMessage("");
      loadTicketDetails(selectedTicket.id);
    } catch (error) {
      console.error("Error sending chat message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleAssignTicket = async (ticketId: string, employeeIds: string[]) => {
    try {
      const assignments = employeeIds.map(employeeId => ({
        ticket_id: ticketId,
        employee_id: employeeId,
        assigned_by: "Admin",
        assigned_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("ticket_assignments")
        .insert(assignments);

      if (error) throw error;

      // Add to history
      await supabase
        .from("ticket_history")
        .insert({
          ticket_id: ticketId,
          user_name: "Admin",
          action: `Ticket assigned to ${employeeIds.length} employee(s)`,
          created_at: new Date().toISOString()
        });

      toast.success("Ticket assigned successfully!");
      setIsAssignDialogOpen(false);
      loadTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const handleShareTicket = async () => {
    if (!selectedTicket || selectedEmployees.length === 0) return;

    try {
      // Create ticket assignments for selected employees
      const assignments = selectedEmployees.map((employeeId) => ({
        ticket_id: selectedTicket.id,
        employee_id: employeeId,
        assigned_by: "Admin",
        assigned_at: new Date().toISOString(),
      }));

      const { error: assignError } = await supabase
        .from("ticket_assignments")
        .insert(assignments);

      if (assignError) throw assignError;

      // Add history entry
      await supabase.from("ticket_history").insert({
        ticket_id: selectedTicket.id,
        user_name: "Admin",
        action: `Ticket shared with ${selectedEmployees.length} employee(s)`,
        created_at: new Date().toISOString(),
      });

      toast.success(`Ticket shared with ${selectedEmployees.length} employee(s)`);
      setIsShareDialogOpen(false);
      setSelectedEmployees([]);
      // Refresh tickets list
      loadTickets();
    } catch (error) {
      console.error("Error sharing ticket:", error);
      toast.error("Failed to share ticket");
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

      toast.success("Ticket deleted successfully");
      loadTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
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

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTicket || draggedTicket.status === newStatus) {
      setDraggedTicket(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("tickets")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", draggedTicket.id);

      if (error) throw error;

      // Add history entry
      await supabase
        .from("ticket_history")
        .insert({
          ticket_id: draggedTicket.id,
          user_name: "Admin",
          action: `Ticket status changed from ${draggedTicket.status} to ${newStatus} via drag and drop.`
        });

      toast.success(`Ticket moved to ${newStatus}`);
      setDraggedTicket(null);
      loadTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
      setDraggedTicket(null);
    }
  };

  const filteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = ticket.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());
      
      // If no filters are selected, show all tickets
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(ticket.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(ticket.priority);
      
      let matchesTime = true;
      if (timeFilter.length > 0) {
        const ticketDate = new Date(ticket.created_at);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        matchesTime = timeFilter.some(filter => {
          switch (filter) {
            case "Today": return ticketDate >= oneDayAgo;
            case "This Week": return ticketDate >= oneWeekAgo;
            case "This Month": return ticketDate >= oneMonthAgo;
            default: return true;
          }
        });
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTime;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortField as keyof typeof a] as string | number;
      let bValue: string | number = b[sortField as keyof typeof b] as string | number;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const totalCount = filteredTickets.length;
  const paginatedTickets = filteredTickets.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const toggleSelectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.whalesync_postgres_id));
    }
  };

  const openTicketDetails = async (ticketId: string) => {
    await loadTicketDetails(ticketId);
    setIsDetailsDialogOpen(true);
  };

  const openEditTicket = async (ticketId: string) => {
    await loadTicketDetails(ticketId);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", ticketId);

      if (error) throw error;

      // Add to history
      await supabase
        .from("ticket_history")
        .insert({
          ticket_id: ticketId,
          user_name: "Admin",
          action: "Ticket details updated",
          created_at: new Date().toISOString()
        });

      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, ...updates, updated_at: new Date().toISOString() } : ticket
        )
      );

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      }

      toast.success("Ticket updated successfully");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  const openShareTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedEmployees([]);
    setIsShareDialogOpen(true);
  };

  // Reset page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, statusFilter, priorityFilter, timeFilter]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Stats Cards */}
          <div className="py-2">
            <TicketStatisticsCards stats={stats} />
          </div>

          {/* Filters */}
          <div className="py-2">
            <TicketFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showKanban={showKanban}
            setShowKanban={setShowKanban}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            onCreateTicket={() => setIsCreateDialogOpen(true)}
            />
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-hidden px-4 py-2">
            <div className="h-full overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading tickets...</div>
                </div>
              ) : paginatedTickets.length > 0 ? (
                showKanban ? (
                  <TicketKanbanView
                    tickets={filteredTickets}
                    draggedTicket={draggedTicket}
                    dragOverColumn={dragOverColumn}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onViewTicket={openTicketDetails}
                    formatDate={formatDate}
                  />
                ) : (
                  <TicketTableView
                    tickets={paginatedTickets}
                    visibleColumns={visibleColumns}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewTicket={openTicketDetails}
                    onEditTicket={openEditTicket}
                    onShareTicket={openShareTicket}
                    onDeleteTicket={handleDeleteTicket}
                    formatDate={formatDate}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={setPageIndex}
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-muted-foreground">No tickets found</div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
          onAssignTicket={() => setIsAssignDialogOpen(true)}
          onUpdateTicket={handleUpdateTicket}
          formatDate={formatDate}
        />

        <AssignTicketModal
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          selectedTicket={selectedTicket}
          employees={employees}
          onAssignTicket={handleAssignTicket}
        />

        <ShareTicketModal
          isOpen={isShareDialogOpen}
          onClose={() => {
            setIsShareDialogOpen(false);
            setSelectedEmployees([]);
          }}
          selectedTicket={selectedTicket}
          employees={employees}
          selectedEmployees={selectedEmployees}
          onToggleEmployeeSelection={toggleEmployeeSelection}
          onToggleSelectAllEmployees={toggleSelectAllEmployees}
          onShareTicket={handleShareTicket}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
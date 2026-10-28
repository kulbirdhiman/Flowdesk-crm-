"use client";

import { Badge } from "@/components/ui/badge";

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
}

interface TicketListViewProps {
  tickets: Ticket[];
  loading: boolean;
  onViewTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
}

export default function TicketListView({
  tickets,
  loading,
  onViewTicket,
  formatDate
}: TicketListViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500';
      case 'High': return 'border-orange-500';
      case 'Medium': return 'border-yellow-500';
      case 'Low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Escalated': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No tickets found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map(ticket => (
        <div 
          key={ticket.id} 
          className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getPriorityColor(ticket.priority)}`}
          onClick={() => onViewTicket(ticket.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <p className="text-sm text-muted-foreground">#{ticket.ticket_number}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{ticket.company}</h3>
                <p className="text-xs text-muted-foreground truncate">{ticket.client_name}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 mx-4">
            <p className="text-sm text-muted-foreground line-clamp-1">{ticket.issue}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {ticket.priority}
            </Badge>
            <div className="text-xs text-muted-foreground">{formatDate(ticket.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

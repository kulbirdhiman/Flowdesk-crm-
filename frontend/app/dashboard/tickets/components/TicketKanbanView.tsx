"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";

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

interface TicketKanbanViewProps {
  tickets: Ticket[];
  draggedTicket: Ticket | null;
  dragOverColumn: string | null;
  onDragStart: (e: React.DragEvent, ticket: Ticket) => void;
  onDragOver: (e: React.DragEvent, status: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, newStatus: string) => void;
  onViewTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
}

export default function TicketKanbanView({
  tickets,
  draggedTicket,
  dragOverColumn,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onViewTicket,
  formatDate
}: TicketKanbanViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-l-red-500';
      case 'High': return 'border-l-orange-500';
      case 'Medium': return 'border-l-yellow-500';
      case 'Low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const statusColumns = [
    { 
      status: 'New', 
      color: 'bg-blue-500', 
      title: 'New',
      tickets: tickets.filter(t => t.status === 'New')
    },
    { 
      status: 'In Progress', 
      color: 'bg-yellow-500', 
      title: 'In Progress',
      tickets: tickets.filter(t => t.status === 'In Progress')
    },
    { 
      status: 'Escalated', 
      color: 'bg-orange-500', 
      title: 'Escalated',
      tickets: tickets.filter(t => t.status === 'Escalated')
    },
    { 
      status: 'Resolved', 
      color: 'bg-green-500', 
      title: 'Resolved',
      tickets: tickets.filter(t => t.status === 'Resolved')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusColumns.map(column => (
        <div 
          key={column.status}
          className={`space-y-3 p-3 rounded-lg transition-colors border ${
            dragOverColumn === column.status ? 'bg-primary/10 border-primary border-2 border-dashed' : 'bg-muted/30 border-border'
          }`}
          onDragOver={(e) => onDragOver(e, column.status)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, column.status)}
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
            <h3 className="font-semibold text-foreground">
              {column.title} ({column.tickets.length})
            </h3>
          </div>
          
          {column.tickets.map(ticket => (
            <Card 
              key={ticket.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getPriorityColor(ticket.priority)} ${
                draggedTicket?.id === ticket.id ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => onDragStart(e, ticket)}
              onClick={() => onViewTicket(ticket.id)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">#{ticket.ticket_number}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-1">{ticket.company}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2" title={ticket.issue}>
                    {ticket.issue.split(' ').slice(0, 15).join(' ')}
                    {ticket.issue.split(' ').length > 15 && '...'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ticket.client_name}</span>
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}

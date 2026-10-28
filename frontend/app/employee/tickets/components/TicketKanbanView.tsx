"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  loading: boolean;
  activeTicket: Ticket | null;
  isDragging: boolean;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onViewTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
}

const DraggableTicket = ({ ticket, onViewTicket, formatDate }: { 
  ticket: Ticket; 
  onViewTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500';
      case 'High': return 'border-orange-500';
      case 'Medium': return 'border-yellow-500';
      case 'Low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getPriorityColor(ticket.priority)} bg-gradient-to-t from-primary/5 to-card shadow-xs ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
      onClick={() => onViewTicket(ticket.id)}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{ticket.ticket_number}</span>
            <Badge variant="outline" className="text-xs">
              {ticket.priority}
            </Badge>
          </div>
          <h4 className="text-sm font-medium line-clamp-1 text-foreground">{ticket.company}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{ticket.issue}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{ticket.client_name}</span>
            <span>{formatDate(ticket.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DroppableColumn = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
        isOver ? 'bg-primary/10 border-2 border-primary border-dashed' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default function TicketKanbanView({
  tickets,
  loading,
  activeTicket,
  isDragging,
  onDragStart,
  onDragEnd,
  onViewTicket,
  formatDate
}: TicketKanbanViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const statusColumns = [
    { status: 'New', color: 'bg-blue-500', count: tickets.filter(t => t.status === 'New').length },
    { status: 'In Progress', color: 'bg-yellow-500', count: tickets.filter(t => t.status === 'In Progress').length },
    { status: 'Escalated', color: 'bg-orange-500', count: tickets.filter(t => t.status === 'Escalated').length },
    { status: 'Resolved', color: 'bg-green-500', count: tickets.filter(t => t.status === 'Resolved').length }
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map(({ status, color, count }) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-muted/50 to-background border border-border/50 rounded-lg">
              <div className={`w-3 h-3 ${color} rounded-full`}></div>
              <h3 className="text-sm font-medium text-foreground">{status} ({count})</h3>
            </div>
            <SortableContext items={tickets.filter(t => t.status === status).map(t => t.id)} strategy={verticalListSortingStrategy}>
              <DroppableColumn status={status}>
                {tickets.filter(t => t.status === status).map(ticket => (
                  <DraggableTicket 
                    key={ticket.id} 
                    ticket={ticket} 
                    onViewTicket={onViewTicket}
                    formatDate={formatDate}
                  />
                ))}
              </DroppableColumn>
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTicket ? (
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 bg-gradient-to-t from-primary/5 to-card shadow-xs opacity-90">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">#{activeTicket.ticket_number}</span>
                  <Badge variant="outline" className="text-xs">
                    {activeTicket.priority}
                  </Badge>
                </div>
                <h4 className="text-sm font-medium line-clamp-1 text-foreground">{activeTicket.company}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{activeTicket.issue}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activeTicket.client_name}</span>
                  <span>{formatDate(activeTicket.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

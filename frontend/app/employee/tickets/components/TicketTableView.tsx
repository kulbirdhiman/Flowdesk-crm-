"use client";

import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Share2, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface TicketTableViewProps {
  tickets: Ticket[];
  loading: boolean;
  visibleColumns: {
    ticket: boolean;
    company: boolean;
    client: boolean;
    status: boolean;
    priority: boolean;
    created: boolean;
    actions: boolean;
  };
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (column: string) => void;
  onViewTicket: (ticketId: string) => void;
  onShareTicket: (ticket: Ticket) => void;
  onEditTicket: (ticketId: string) => void;
  onDeleteTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
}

export default function TicketTableView({
  tickets,
  loading,
  visibleColumns,
  sortColumn,
  sortDirection,
  onSort,
  onViewTicket,
  onShareTicket,
  onEditTicket,
  onDeleteTicket,
  formatDate
}: TicketTableViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Escalated': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-2 h-4 w-4 inline" />;
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
    <div className="w-full rounded-md border overflow-hidden flex-1 min-h-0 flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <TableComponent className="w-full">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="hover:bg-transparent">
              {visibleColumns.ticket && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("ticket_number")}
                >
                  <span className="flex items-center">
                    Ticket{getSortIcon("ticket_number")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.company && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("company")}
                >
                  <span className="flex items-center">
                    Company{getSortIcon("company")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.client && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("client_name")}
                >
                  <span className="flex items-center">
                    Client{getSortIcon("client_name")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.status && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("status")}
                >
                  <span className="flex items-center">
                    Status{getSortIcon("status")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.priority && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("priority")}
                >
                  <span className="flex items-center">
                    Priority{getSortIcon("priority")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.created && (
                <TableHead 
                  className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => onSort("created_at")}
                >
                  <span className="flex items-center">
                    Created{getSortIcon("created_at")}
                  </span>
                </TableHead>
              )}
              {visibleColumns.actions && (
                <TableHead className="h-10 px-3 text-sm font-semibold bg-background">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                {visibleColumns.ticket && (
                  <TableCell className="px-3 py-3 text-sm">
                    #{ticket.ticket_number}
                  </TableCell>
                )}
                {visibleColumns.company && (
                  <TableCell className="px-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{ticket.company}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{ticket.issue}</p>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.client && (
                  <TableCell className="px-3 py-3 text-sm">
                    {ticket.client_name}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell className="px-3 py-3">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.priority && (
                  <TableCell className="px-3 py-3">
                    <Badge variant="outline" className="text-xs">
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.created && (
                  <TableCell className="px-3 py-3 text-sm">
                    {formatDate(ticket.created_at)}
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewTicket(ticket.id);
                              }}
                              className="h-6 w-6 hover:bg-muted flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white"><p>View</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onShareTicket(ticket);
                              }}
                              className="h-6 w-6 hover:bg-muted flex-shrink-0"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white"><p>Share</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTicket(ticket.id);
                              }}
                              className="h-6 w-6 hover:bg-muted flex-shrink-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white"><p>Edit</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTicket(ticket.id);
                              }}
                              className="h-6 w-6 hover:bg-muted flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="bg-black text-white"><p>Delete</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>
    </div>
  );
}

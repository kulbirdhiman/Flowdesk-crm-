"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit, 
  Share2, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
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

interface VisibleColumns {
  ticketNumber: boolean;
  company: boolean;
  client: boolean;
  issue: boolean;
  status: boolean;
  priority: boolean;
  assignedTo: boolean;
  created: boolean;
  actions: boolean;
}

interface TicketTableViewProps {
  tickets: Ticket[];
  visibleColumns: VisibleColumns;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewTicket: (ticketId: string) => void;
  onEditTicket: (ticketId: string) => void;
  onShareTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
  formatDate: (date: string) => string;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function TicketTableView({
  tickets,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onViewTicket,
  onEditTicket,
  onShareTicket,
  onDeleteTicket,
  formatDate,
  pageIndex,
  pageSize,
  totalCount,
  onPageChange
}: TicketTableViewProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : 
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Escalated": return "bg-orange-100 text-orange-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="h-full flex flex-col">
      {tickets.length > 0 ? (
        <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="overflow-hidden">
            <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {visibleColumns.ticketNumber && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-16">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("ticket_number")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      #
                      {getSortIcon("ticket_number")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.company && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-24">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("company")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Company
                      {getSortIcon("company")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.client && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-28">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("client_name")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Client
                      {getSortIcon("client_name")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.issue && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-40">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("issue")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Issue
                      {getSortIcon("issue")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.status && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-20">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("status")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.priority && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-20">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("priority")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Priority
                      {getSortIcon("priority")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.assignedTo && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-24">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("assigned_to")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Assigned
                      {getSortIcon("assigned_to")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.created && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-24">
                    <Button
                      variant="ghost"
                      onClick={() => onSort("created_at")}
                      className="h-7 px-1 hover:bg-transparent text-xs font-semibold"
                    >
                      Created
                      {getSortIcon("created_at")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.actions && (
                  <TableHead className="text-xs font-semibold text-foreground px-2 py-3 w-20">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
          </Table>
          </div>
          
          {/* Scrollable Table Body */}
          <div className="flex-1 overflow-y-auto">
            <Table className="w-full table-fixed">
            <TableBody>
              {tickets.map(ticket => (
                <TableRow 
                  key={ticket.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onViewTicket(ticket.id)}
                >
                  {visibleColumns.ticketNumber && (
                    <TableCell className="py-3 px-2 w-16">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{ticket.ticket_number}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.company && (
                    <TableCell className="py-3 px-2 w-24">
                      <div className="font-semibold text-sm truncate" title={ticket.company}>{ticket.company}</div>
                    </TableCell>
                  )}
                  {visibleColumns.client && (
                    <TableCell className="py-3 px-2 w-28">
                      <div className="text-sm truncate" title={ticket.client_name}>{ticket.client_name}</div>
                      <div className="text-xs text-muted-foreground truncate" title={ticket.client_email}>{ticket.client_email}</div>
                    </TableCell>
                  )}
                  {visibleColumns.issue && (
                    <TableCell className="py-3 px-2 w-40">
                      <div className="text-sm truncate" title={ticket.issue}>
                        {ticket.issue.split(' ').slice(0, 12).join(' ')}
                        {ticket.issue.split(' ').length > 12 && '...'}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell className="py-3 px-2 w-20">
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'In Progress' ? 'Progress' : ticket.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.priority && (
                    <TableCell className="py-3 px-2 w-20">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          ticket.priority === 'Critical' ? 'border-red-500 text-red-700' :
                          ticket.priority === 'High' ? 'border-orange-500 text-orange-700' :
                          ticket.priority === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }`}
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.assignedTo && (
                    <TableCell className="py-3 px-2 w-24">
                      <div className="text-sm truncate" title={ticket.assigned_to}>{ticket.assigned_to}</div>
                    </TableCell>
                  )}
                  {visibleColumns.created && (
                    <TableCell className="py-3 px-2 w-24">
                      <div className="text-sm">{new Date(ticket.created_at).toLocaleDateString()}</div>
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell className="py-3 px-2 w-20">
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewTicket(ticket.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-muted"
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
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditTicket(ticket.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-muted"
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
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShareTicket(ticket);
                                }}
                                className="h-6 w-6 p-0 hover:bg-muted"
                              >
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-black text-white">
                              <p>Share</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTicket(ticket.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-muted"
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
              ))}
            </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tickets found</p>
          </div>
        </div>
      )}

      {/* Pagination - Fixed at bottom */}
      {tickets.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t border-border bg-muted/20 px-4 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} tickets
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => onPageChange(0)}
              className="h-9"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
              className="h-9"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pageIndex + 1) * pageSize >= totalCount}
              onClick={() => onPageChange(pageIndex + 1)}
              className="h-9"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pageIndex + 1) * pageSize >= totalCount}
              onClick={() => onPageChange(totalPages - 1)}
              className="h-9"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

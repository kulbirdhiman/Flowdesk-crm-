"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, UserCheck, MessageSquare, Edit, Save, X } from "lucide-react";

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

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: Ticket | null;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: string) => void;
  onSendChat: () => void;
  onAssignTicket: () => void;
  onUpdateTicket?: (ticketId: string, updates: Partial<Ticket>) => void;
  formatDate: (date: string) => string;
}

export default function TicketDetailsModal({
  isOpen,
  onClose,
  selectedTicket,
  chatMessage,
  setChatMessage,
  onUpdateTicketStatus,
  onSendChat,
  onAssignTicket,
  onUpdateTicket,
  formatDate
}: TicketDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    client_name: '',
    client_email: '',
    company: '',
    issue: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical'
  });

  useEffect(() => {
    if (selectedTicket) {
      setEditForm({
        client_name: selectedTicket.client_name,
        client_email: selectedTicket.client_email,
        company: selectedTicket.company,
        issue: selectedTicket.issue,
        priority: selectedTicket.priority
      });
    }
  }, [selectedTicket]);

  const handleSaveEdit = () => {
    if (selectedTicket && onUpdateTicket) {
      onUpdateTicket(selectedTicket.id, editForm);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedTicket) {
      setEditForm({
        client_name: selectedTicket.client_name,
        client_email: selectedTicket.client_email,
        company: selectedTicket.company,
        issue: selectedTicket.issue,
        priority: selectedTicket.priority
      });
    }
    setIsEditing(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ticket #{selectedTicket?.ticket_number}: {selectedTicket?.company}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="ml-4"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Ticket'}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit ticket details below' : 'View and manage ticket details'}
          </DialogDescription>
        </DialogHeader>
        
        {selectedTicket && (
          <div className="space-y-6">
            {/* Issue Description - Prominently Displayed */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Issue Description</h3>
              {isEditing ? (
                <Textarea
                  value={editForm.issue}
                  onChange={(e) => setEditForm({ ...editForm, issue: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Describe the issue..."
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{selectedTicket.issue}</p>
              )}
            </div>

            {/* Ticket Actions */}
            <div className="flex flex-wrap gap-2">
              {selectedTicket.status !== 'Resolved' && (
                <Button
                  onClick={() => onUpdateTicketStatus(selectedTicket.id, 'Resolved')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              {selectedTicket.status === 'In Progress' && (
                <Button
                  onClick={() => onUpdateTicketStatus(selectedTicket.id, 'Escalated')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Escalate to Admin
                </Button>
              )}
              <Button
                onClick={onAssignTicket}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign to Employee
              </Button>
            </div>

            {/* Client Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Client Details</h4>
                <div className="space-y-3 text-sm">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1">Contact Name</label>
                        <Input
                          value={editForm.client_name}
                          onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Email</label>
                        <Input
                          value={editForm.client_email}
                          onChange={(e) => setEditForm({ ...editForm, client_email: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Company</label>
                        <Input
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Contact:</strong> {selectedTicket.client_name}</p>
                      <p><strong>Email:</strong> {selectedTicket.client_email}</p>
                      <p><strong>Company:</strong> {selectedTicket.company}</p>
                    </>
                  )}
                  <p><strong>Submitted:</strong> {formatDate(selectedTicket.created_at)}</p>
                  <p><strong>Updated:</strong> {formatDate(selectedTicket.updated_at)}</p>
                  <p><strong>Assigned:</strong> {selectedTicket.assigned_to}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status & Priority</h4>
                <div className="space-y-3">
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                  {isEditing ? (
                    <div>
                      <label className="block text-xs font-medium mb-1">Priority</label>
                      <Select
                        value={editForm.priority}
                        onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => 
                          setEditForm({ ...editForm, priority: value })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Badge variant="outline">
                      {selectedTicket.priority} Priority
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}

            {/* Chat Section */}
            <div>
              <h4 className="font-semibold mb-4">Internal Chat</h4>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-4">
                {selectedTicket.chat && selectedTicket.chat.length > 0 ? (
                  selectedTicket.chat.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-xs">
                        <p className="text-xs text-muted-foreground mb-1">
                          {msg.user_name}
                        </p>
                        <div className={`p-3 rounded-lg ${
                          msg.sender_type === 'sent' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No chat messages yet.
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Input
                  placeholder="Type message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSendChat()}
                />
                <Button onClick={onSendChat} size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ticket History */}
            <div>
              <h4 className="font-semibold mb-4">Ticket History</h4>
              <div className="space-y-4">
                {selectedTicket.history && selectedTicket.history.map((entry, index) => (
                  <div key={entry.id} className="flex items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-4 h-4 bg-gray-400 rounded-full mt-1"></div>
                      {index !== selectedTicket.history!.length - 1 && (
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.user_name} • {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


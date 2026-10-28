"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewTicket {
  client_name: string;
  client_email: string;
  company: string;
  issue: string;
  priority: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTicket: NewTicket;
  setNewTicket: (ticket: NewTicket) => void;
  onCreateTicket: () => void;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  newTicket,
  setNewTicket,
  onCreateTicket
}: CreateTicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Raise a New Query</DialogTitle>
          <DialogDescription>
            Create a new support ticket for a client.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="client_name">Client Name *</Label>
            <Input
              id="client_name"
              value={newTicket.client_name}
              onChange={(e) => setNewTicket({ ...newTicket, client_name: e.target.value })}
              placeholder="Enter client name"
            />
          </div>
          
          <div>
            <Label htmlFor="client_email">Client Email *</Label>
            <Input
              id="client_email"
              type="email"
              value={newTicket.client_email}
              onChange={(e) => setNewTicket({ ...newTicket, client_email: e.target.value })}
              placeholder="Enter client email"
            />
          </div>
          
          <div>
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              value={newTicket.company}
              onChange={(e) => setNewTicket({ ...newTicket, company: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <Label htmlFor="issue">Issue / Query *</Label>
            <Textarea
              id="issue"
              rows={4}
              value={newTicket.issue}
              onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
              placeholder="Describe the issue or query"
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
              <SelectTrigger>
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCreateTicket}>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

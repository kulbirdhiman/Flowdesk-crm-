"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Edit2, Save, User, X } from "lucide-react";
import { format } from "date-fns";

interface Props {
  lead: any;
  isEditing: boolean;
  editData: any;
  setEditData: (d: any) => void;
  followUpDate?: Date;
  setFollowUpDate: (d?: Date) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function LeadContactServiceCard({
  lead,
  isEditing,
  editData,
  setEditData,
  followUpDate,
  setFollowUpDate,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact & Service Information
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Service</p>
            {isEditing ? (
              <Select value={editData.services || ""} onValueChange={(value) => setEditData({ ...editData, services: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brand Development">Brand Development</SelectItem>
                  <SelectItem value="Canton Fair">Canton Fair</SelectItem>
                  <SelectItem value="Video Call">Video Call</SelectItem>
                  <SelectItem value="USA LLC Formation">USA LLC Formation</SelectItem>
                  <SelectItem value="Dropshipping">Dropshipping</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium mt-1">{lead.services || "-"}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Source</p>
            <p className="text-sm font-medium mt-1">{lead.source || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Date Added</p>
            <p className="text-sm font-medium mt-1">{lead.date_and_time ? new Date(lead.date_and_time).toLocaleDateString() : "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Follow Up Timeline</p>
            <p className="text-sm font-medium mt-1">{lead.follow_up_day || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Follow Up Date</p>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {followUpDate ? format(followUpDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="text-sm font-medium mt-1">{lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString() : "-"}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Interest Level</p>
            <p className="text-sm font-medium mt-1">{lead.call_remark || "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



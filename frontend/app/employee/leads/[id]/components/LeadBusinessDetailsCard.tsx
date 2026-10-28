"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Edit2, Save, X } from "lucide-react";

interface Props {
  lead: any;
  isEditing: boolean;
  editData: any;
  setEditData: (d: any) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function LeadBusinessDetailsCard({ lead, isEditing, editData, setEditData, onEdit, onCancel, onSave }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Business Details
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
            <p className="text-xs font-medium text-muted-foreground uppercase">Deal Amount</p>
            {isEditing ? (
              <Select value={editData.deal_amount?.toString() || ""} onValueChange={(value) => setEditData({ ...editData, deal_amount: parseFloat(value) })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">₹10,000</SelectItem>
                  <SelectItem value="25000">₹25,000</SelectItem>
                  <SelectItem value="45000">₹45,000</SelectItem>
                  <SelectItem value="75000">₹75,000</SelectItem>
                  <SelectItem value="100000">₹1,00,000</SelectItem>
                  <SelectItem value="150000">₹1,50,000</SelectItem>
                  <SelectItem value="200000">₹2,00,000</SelectItem>
                  <SelectItem value="500000">₹5,00,000</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium mt-1">{lead.deal_amount ? `₹${lead.deal_amount.toLocaleString()}` : "-"}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Client Budget</p>
            {isEditing ? (
              <Select value={editData.client_budget || ""} onValueChange={(value) => setEditData({ ...editData, client_budget: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under ₹10,000">Under ₹10,000</SelectItem>
                  <SelectItem value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</SelectItem>
                  <SelectItem value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</SelectItem>
                  <SelectItem value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</SelectItem>
                  <SelectItem value="Above ₹2,50,000">Above ₹2,50,000</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium mt-1">{lead.client_budget || "-"}</p>
            )}
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Current Business Turnover</p>
            {isEditing ? (
              <Select value={editData.current_business_turnover || ""} onValueChange={(value) => setEditData({ ...editData, current_business_turnover: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select turnover" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under ₹1 Lakh">Under ₹1 Lakh</SelectItem>
                  <SelectItem value="₹1 Lakh - ₹5 Lakhs">₹1 Lakh - ₹5 Lakhs</SelectItem>
                  <SelectItem value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs</SelectItem>
                  <SelectItem value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</SelectItem>
                  <SelectItem value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</SelectItem>
                  <SelectItem value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</SelectItem>
                  <SelectItem value="Above ₹1 Crore">Above ₹1 Crore</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium mt-1">{lead.current_business_turnover || "-"}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Phone, Mail, MapPin, Briefcase, Calendar as CalendarIcon, 
  DollarSign, User, ChevronLeft, Building2, Tag,
  MessageCircle, Clock, Edit2, Save, X, CalendarDays
} from "lucide-react";
import DispositionSection from "@/components/leadsdetailscomponent/DispositionSection";
import CallHistory from "@/components/leadsdetailscomponent/CallHistory";
import { Skeleton } from "@/components/ui/skeleton";
import LeadHeader from "./components/LeadHeader";
import LeadContactServiceCard from "./components/LeadContactServiceCard";
import LeadBusinessDetailsCard from "./components/LeadBusinessDetailsCard";

interface Lead {
  whalesync_postgres_id: string;
  name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  services: string | null;
  source: string | null;
  stage: string | null;
  deal_amount: number | null;
  client_budget: string | null;
  current_business_turnover: string | null;
  date_and_time: string | null;
  follow_up_day: string | null;
  follow_up_date: string | null;
  call_remark: string | null;
  assigned_to?: {
    whalesync_postgres_id: string;
    full_name: string;
    profile_photo: string;
  } | null;
}

export default function EmployeeLeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Lead>>({});
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

  const fetchLeadDetails = async () => {
    if (!leadId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("Leads")
      .select(`
        whalesync_postgres_id, name, email, mobile, city, services, source, stage,
        deal_amount, client_budget, current_business_turnover, date_and_time, follow_up_day, follow_up_date, call_remark, assigned_to,
        assigned_to (whalesync_postgres_id, full_name, profile_photo)
      `)
      .eq("whalesync_postgres_id", leadId)
      .single();

    if (error) {
      console.error("Error fetching lead:", error);
    } else {
      setLead(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const updateLead = async (payload: any) => {
    if (!lead) return false;
    
    const { error } = await supabase
      .from("Leads")
      .update(payload)
      .eq("whalesync_postgres_id", lead.whalesync_postgres_id);
    
    if (error) {
      console.error("Update failed:", error.message);
      return false;
    }
    
    await fetchLeadDetails();
    return true;
  };

  const handleEdit = () => {
    if (lead) {
      setEditData({
        services: lead.services,
        source: lead.source,
        follow_up_day: lead.follow_up_day,
        follow_up_date: lead.follow_up_date,
        call_remark: lead.call_remark,
        deal_amount: lead.deal_amount,
        client_budget: lead.client_budget,
        current_business_turnover: lead.current_business_turnover,
      });
      // Initialize calendar date if follow_up_date exists
      if (lead.follow_up_date) {
        setFollowUpDate(new Date(lead.follow_up_date));
      } else {
        setFollowUpDate(undefined);
      }
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!lead) return;
    
    // Include the selected follow-up date in the update
    const updateData = {
      ...editData,
      follow_up_date: followUpDate ? followUpDate.toISOString() : null,
    };
    
    const success = await updateLead(updateData);
    if (success) {
      setIsEditing(false);
      setEditData({});
      setFollowUpDate(undefined);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setFollowUpDate(undefined);
  };

  const getStageColor = (stage?: string | null) => {
    switch (stage?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "not connected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "follow up required":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "converted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "lost":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-full overflow-auto">
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-lg font-medium mb-4">Lead not found</p>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = lead.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Lead Header Card */}
        <LeadHeader lead={lead} initials={initials} getStageColor={getStageColor} onBack={() => router.back()} />

        {/* Disposition Section */}
        <DispositionSection
          lead={lead}
          updateLead={updateLead}
          refreshLead={fetchLeadDetails}
          fireToast={() => {}}
        />

        {/* Lead Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadContactServiceCard
            lead={lead}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            followUpDate={followUpDate}
            setFollowUpDate={setFollowUpDate}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
          />
          <LeadBusinessDetailsCard
            lead={lead}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>

        </div>
      </div>
    </div>
  );
}





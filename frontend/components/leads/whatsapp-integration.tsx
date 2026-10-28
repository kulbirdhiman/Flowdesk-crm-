"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import WhatsAppHeader from "./whatsapp/WhatsAppHeader";
import MessagesTab from "./whatsapp/MessagesTab";
import TemplatesTab from "./whatsapp/TemplatesTab";
import CampaignsTab from "./whatsapp/CampaignsTab";
import AnalyticsTab from "./whatsapp/AnalyticsTab";
import { 
  WhatsAppMessage, 
  WhatsAppTemplate, 
  WhatsAppCampaign, 
  Lead, 
  DEFAULT_TEMPLATES 
} from "./whatsapp/types";
import { 
  getStatusIcon, 
  getStatusColor, 
  applyTemplate, 
  createMessage, 
  updateTemplateUsage, 
  updateMessageStatus 
} from "./whatsapp/utils";

export function WhatsAppIntegration() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(DEFAULT_TEMPLATES);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      const { data: leads, error } = await supabase
        .from('Leads')
        .select('*')
        .order('date_and_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      return leads || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  };

  const sendMessage = async (leadId: string, message: string, template?: string) => {
    try {
      setLoading(true);
      
      // Create new message
      const newMsg = createMessage(leadId, message, selectedLead, template);
      setMessages(prev => [newMsg, ...prev]);
      setNewMessage('');
      
      // Update template usage
      if (template) {
        setTemplates(prev => updateTemplateUsage(prev, template));
      }

      // Simulate delivery status update
      setTimeout(() => {
        setMessages(prev => updateMessageStatus(prev, newMsg.id, 'delivered'));
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (template: WhatsAppTemplate) => {
    const content = applyTemplate(template, selectedLead);
    setNewMessage(content);
    setSelectedTemplate(template.id);
    setShowTemplates(false);
  };

  const handleSendMessage = () => {
    if (selectedLead) {
      sendMessage(selectedLead.whalesync_postgres_id, newMessage, selectedTemplate);
    }
  };

  const handleUseTemplate = () => {
    setShowTemplates(true);
  };

  const handleCreateCampaign = () => {
    // TODO: Implement campaign creation
    console.log('Create campaign clicked');
  };

  useEffect(() => {
    // Initialize with sample data or fetch from API
    const initializeData = async () => {
      const leads = await fetchLeads();
      if (leads.length > 0) {
        setSelectedLead(leads[0]);
      }
    };
    
    initializeData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <WhatsAppHeader
        onTemplatesClick={() => setShowTemplates(!showTemplates)}
        onCampaignsClick={() => setShowCampaigns(!showCampaigns)}
      />

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <MessagesTab
            selectedLead={selectedLead}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            onUseTemplate={handleUseTemplate}
            messages={messages}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <TemplatesTab
            templates={templates}
            onApplyTemplate={handleApplyTemplate}
          />
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <CampaignsTab
            campaigns={campaigns}
            onCreateCampaign={handleCreateCampaign}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
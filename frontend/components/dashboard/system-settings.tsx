"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database 
} from "lucide-react";
import SystemSettingsHeader from "./settings/SystemSettingsHeader";
import SettingsOverviewCards from "./settings/SettingsOverviewCards";
import GeneralSettingsTab from "./settings/GeneralSettingsTab";
import NotificationsSettingsTab from "./settings/NotificationsSettingsTab";
import SecuritySettingsTab from "./settings/SecuritySettingsTab";
import IntegrationsSettingsTab from "./settings/IntegrationsSettingsTab";
import AppearanceSettingsTab from "./settings/AppearanceSettingsTab";
import AdvancedSettingsTab from "./settings/AdvancedSettingsTab";
import { SystemSettings } from "./settings/types";
import { 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  resetSettingsToDefault, 
  handleSettingChange, 
  validateSettings 
} from "./settings/utils";

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(loadSettingsFromStorage());
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadedSettings = loadSettingsFromStorage();
    setSettings(loadedSettings);
  }, []);

  const handleSettingChangeWrapper = (category: keyof SystemSettings, key: string, value: any) => {
    const newSettings = handleSettingChange(settings, category, key, value);
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!validateSettings(settings)) {
      return;
    }

    setLoading(true);
    try {
      await saveSettingsToStorage(settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = resetSettingsToDefault();
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemSettingsHeader
        onSaveSettings={handleSaveSettings}
        onResetSettings={handleResetSettings}
        hasChanges={hasChanges}
        loading={loading}
      />

      {/* Settings Overview Cards */}
      <SettingsOverviewCards settings={settings} />

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <GeneralSettingsTab
            settings={settings}
            onSettingChange={handleSettingChangeWrapper}
          />
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <NotificationsSettingsTab
            settings={settings}
            onSettingChange={handleSettingChangeWrapper}
          />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SecuritySettingsTab
            settings={settings}
            onSettingChange={handleSettingChangeWrapper}
          />
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <IntegrationsSettingsTab
            settings={settings}
            onSettingChange={handleSettingChangeWrapper}
          />
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <AppearanceSettingsTab
            settings={settings}
            onSettingChange={handleSettingChangeWrapper}
          />
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <AdvancedSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
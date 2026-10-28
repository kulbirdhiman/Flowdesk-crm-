import { SystemSettings, DEFAULT_SETTINGS } from "./types"
import { toast } from "sonner"

export const loadSettingsFromStorage = (): SystemSettings => {
  try {
    const savedSettings = localStorage.getItem('system_settings')
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      return { ...DEFAULT_SETTINGS, ...parsedSettings }
    }
  } catch (error) {
    console.error('Error parsing saved settings:', error)
  }
  return DEFAULT_SETTINGS
}

export const saveSettingsToStorage = async (settings: SystemSettings): Promise<void> => {
  try {
    localStorage.setItem('system_settings', JSON.stringify(settings))
    toast.success("Settings saved successfully")
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.error("Failed to save settings")
    throw error
  }
}

export const resetSettingsToDefault = (): SystemSettings => {
  toast.info("Settings reset to defaults")
  return DEFAULT_SETTINGS
}

export const handleSettingChange = (
  settings: SystemSettings,
  category: keyof SystemSettings,
  key: string,
  value: any
): SystemSettings => {
  return {
    ...settings,
    [category]: {
      ...settings[category],
      [key]: value
    }
  }
}

export const validateSettings = (settings: SystemSettings): boolean => {
  // Basic validation
  if (!settings.general.companyName.trim()) {
    toast.error("Company name is required")
    return false
  }
  
  if (!settings.general.companyEmail.trim()) {
    toast.error("Company email is required")
    return false
  }
  
  if (settings.security.sessionTimeout < 5 || settings.security.sessionTimeout > 480) {
    toast.error("Session timeout must be between 5 and 480 minutes")
    return false
  }
  
  return true
}

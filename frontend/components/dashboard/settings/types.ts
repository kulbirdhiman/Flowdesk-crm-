export interface SystemSettings {
  general: {
    companyName: string
    companyEmail: string
    timezone: string
    dateFormat: string
    currency: string
    language: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    leadAssigned: boolean
    leadConverted: boolean
    taskReminder: boolean
    reportGenerated: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordPolicy: string
    ipWhitelist: string[]
    auditLogging: boolean
  }
  integrations: {
    emailProvider: string
    smsProvider: string
    calendarSync: boolean
    crmSync: boolean
    analyticsTracking: boolean
  }
  appearance: {
    theme: string
    primaryColor: string
    logo: string
    favicon: string
    customCss: string
  }
}

export const DEFAULT_SETTINGS: SystemSettings = {
  general: {
    companyName: "Your Company",
    companyEmail: "admin@company.com",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    language: "en"
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    leadAssigned: true,
    leadConverted: true,
    taskReminder: true,
    reportGenerated: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "medium",
    ipWhitelist: [],
    auditLogging: true
  },
  integrations: {
    emailProvider: "smtp",
    smsProvider: "twilio",
    calendarSync: true,
    crmSync: true,
    analyticsTracking: true
  },
  appearance: {
    theme: "light",
    primaryColor: "#3b82f6",
    logo: "",
    favicon: "",
    customCss: ""
  }
}

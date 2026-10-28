import React from "react"

export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  lastLogin?: string
  permissions: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
}

export const PERMISSIONS: Permission[] = [
  // Dashboard & Analytics
  { id: 'dashboard.view', name: 'View Dashboard', description: 'Access main dashboard', category: 'Dashboard', icon: <div className="h-4 w-4" /> },
  { id: 'analytics.view', name: 'View Analytics', description: 'Access advanced analytics', category: 'Dashboard', icon: <div className="h-4 w-4" /> },
  { id: 'reports.generate', name: 'Generate Reports', description: 'Create and export reports', category: 'Dashboard', icon: <div className="h-4 w-4" /> },
  
  // Lead Management
  { id: 'leads.view', name: 'View Leads', description: 'View lead information', category: 'Leads', icon: <div className="h-4 w-4" /> },
  { id: 'leads.create', name: 'Create Leads', description: 'Add new leads', category: 'Leads', icon: <div className="h-4 w-4" /> },
  { id: 'leads.edit', name: 'Edit Leads', description: 'Modify lead information', category: 'Leads', icon: <div className="h-4 w-4" /> },
  { id: 'leads.delete', name: 'Delete Leads', description: 'Remove leads from system', category: 'Leads', icon: <div className="h-4 w-4" /> },
  { id: 'leads.assign', name: 'Assign Leads', description: 'Assign leads to team members', category: 'Leads', icon: <div className="h-4 w-4" /> },
  
  // Sales Management
  { id: 'sales.view', name: 'View Sales', description: 'Access sales data', category: 'Sales', icon: <div className="h-4 w-4" /> },
  { id: 'sales.create', name: 'Create Sales', description: 'Record new sales', category: 'Sales', icon: <div className="h-4 w-4" /> },
  { id: 'sales.edit', name: 'Edit Sales', description: 'Modify sales records', category: 'Sales', icon: <div className="h-4 w-4" /> },
  
  // User Management
  { id: 'users.view', name: 'View Users', description: 'View user information', category: 'Users', icon: <div className="h-4 w-4" /> },
  { id: 'users.create', name: 'Create Users', description: 'Add new users', category: 'Users', icon: <div className="h-4 w-4" /> },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', category: 'Users', icon: <div className="h-4 w-4" /> },
  { id: 'users.delete', name: 'Delete Users', description: 'Remove users from system', category: 'Users', icon: <div className="h-4 w-4" /> },
  
  // System Administration
  { id: 'admin.settings', name: 'System Settings', description: 'Access system configuration', category: 'Admin', icon: <div className="h-4 w-4" /> },
  { id: 'admin.roles', name: 'Manage Roles', description: 'Create and modify user roles', category: 'Admin', icon: <div className="h-4 w-4" /> },
  { id: 'admin.database', name: 'Database Access', description: 'Direct database access', category: 'Admin', icon: <div className="h-4 w-4" /> },
  
  // Communication
  { id: 'communication.email', name: 'Send Emails', description: 'Send email communications', category: 'Communication', icon: <div className="h-4 w-4" /> },
  { id: 'communication.sms', name: 'Send SMS', description: 'Send SMS messages', category: 'Communication', icon: <div className="h-4 w-4" /> },
  
  // Attendance & Tasks
  { id: 'attendance.view', name: 'View Attendance', description: 'Access attendance records', category: 'Attendance', icon: <div className="h-4 w-4" /> },
  { id: 'attendance.manage', name: 'Manage Attendance', description: 'Manage attendance records', category: 'Attendance', icon: <div className="h-4 w-4" /> },
  { id: 'tasks.view', name: 'View Tasks', description: 'Access task information', category: 'Tasks', icon: <div className="h-4 w-4" /> },
  { id: 'tasks.create', name: 'Create Tasks', description: 'Create new tasks', category: 'Tasks', icon: <div className="h-4 w-4" /> },
  { id: 'tasks.edit', name: 'Edit Tasks', description: 'Modify task information', category: 'Tasks', icon: <div className="h-4 w-4" /> },
]

// Group permissions by category for easy rendering in dialogs
export const groupedPermissions: Record<string, Permission[]> = PERMISSIONS.reduce(
  (acc: Record<string, Permission[]>, perm: Permission) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  },
  {}
);

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: PERMISSIONS.map(p => p.id),
    userCount: 0
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Management access with team oversight',
    permissions: [
      'dashboard.view', 'analytics.view', 'reports.generate',
      'leads.view', 'leads.create', 'leads.edit', 'leads.assign',
      'sales.view', 'sales.create', 'sales.edit',
      'users.view', 'communication.email', 'communication.sms',
      'attendance.view', 'attendance.manage', 'tasks.view', 'tasks.create', 'tasks.edit'
    ],
    userCount: 0
  },
  {
    id: 'employee',
    name: 'Employee',
    description: 'Standard employee access',
    permissions: [
      'dashboard.view', 'leads.view', 'leads.create', 'leads.edit',
      'sales.view', 'sales.create', 'communication.email',
      'attendance.view', 'tasks.view', 'tasks.create', 'tasks.edit'
    ],
    userCount: 0
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to system data',
    permissions: [
      'dashboard.view', 'leads.view', 'sales.view', 'users.view',
      'attendance.view', 'tasks.view'
    ],
    userCount: 0
  }
]

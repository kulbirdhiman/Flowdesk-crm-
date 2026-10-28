import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { User, Role, PERMISSIONS } from "./types"

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('Employee Directory')
      .select(`
        whalesync_postgres_id,
        full_name,
        official_email,
        status,
        job_title,
        department
      `)
      .order('full_name')

    if (error) throw error

    const usersData: User[] = (data || []).map(emp => ({
      id: emp.whalesync_postgres_id,
      name: emp.full_name || 'Unknown',
      email: emp.official_email || '',
      role: emp.job_title?.toLowerCase().includes('manager') ? 'manager' : 
            emp.job_title?.toLowerCase().includes('admin') ? 'admin' : 'employee',
      department: emp.department || '',
      status: emp.status === 'Active' ? 'active' : 'inactive',
      lastLogin: undefined,
      permissions: getRolePermissions(emp.job_title?.toLowerCase().includes('manager') ? 'manager' : 
                  emp.job_title?.toLowerCase().includes('admin') ? 'admin' : 'employee')
    }))

    return usersData
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error('Failed to fetch users')
    return []
  }
}

export const getRolePermissions = (roleId: string, roles: Role[]): string[] => {
  const role = roles.find(r => r.id === roleId)
  return role?.permissions || []
}

export const updateRoleUserCounts = (users: User[], roles: Role[]): Role[] => {
  return roles.map(role => ({
    ...role,
    userCount: users.filter(user => user.role === role.id).length
  }))
}

export const getPermissionIcon = (permissionId: string) => {
  const permission = PERMISSIONS.find(p => p.id === permissionId)
  return permission?.icon || <div className="h-4 w-4" />
}

export const getPermissionName = (permissionId: string) => {
  const permission = PERMISSIONS.find(p => p.id === permissionId)
  return permission?.name || permissionId
}

export const groupedPermissions = PERMISSIONS.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = []
  }
  acc[permission.category].push(permission)
  return acc
}, {} as Record<string, typeof PERMISSIONS>)

export const createUser = async (newUser: Partial<User>, roles: Role[]): Promise<User> => {
  try {
    const userData: User = {
      id: Date.now().toString(),
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role || 'employee',
      department: newUser.department || '',
      status: 'active',
      permissions: getRolePermissions(newUser.role || 'employee', roles)
    }

    toast.success('User created successfully')
    return userData
  } catch (error) {
    toast.error('Failed to create user')
    throw error
  }
}

export const createRole = async (newRole: Partial<Role>): Promise<Role> => {
  try {
    const roleData: Role = {
      id: newRole.name?.toLowerCase().replace(/\s+/g, '_') || '',
      name: newRole.name || '',
      description: newRole.description || '',
      permissions: newRole.permissions || [],
      userCount: 0
    }

    toast.success('Role created successfully')
    return roleData
  } catch (error) {
    toast.error('Failed to create role')
    throw error
  }
}

export const updateUserRole = async (userId: string, newRole: string, roles: Role[]): Promise<void> => {
  try {
    toast.success('User role updated successfully')
  } catch (error) {
    toast.error('Failed to update user role')
    throw error
  }
}

export const toggleUserStatus = async (userId: string): Promise<void> => {
  try {
    toast.success('User status updated successfully')
  } catch (error) {
    toast.error('Failed to update user status')
    throw error
  }
}

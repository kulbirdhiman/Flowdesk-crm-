"use client"

import { Button } from "@/components/ui/button"
import { Plus, Shield } from "lucide-react"

interface RoleManagementHeaderProps {
  onAddUser: () => void
  onCreateRole: () => void
}

export default function RoleManagementHeader({
  onAddUser,
  onCreateRole
}: RoleManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
          Role & Permission Management
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
          Manage user roles and system permissions
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
        <Button onClick={onCreateRole} variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Create Role
        </Button>
      </div>
    </div>
  )
}

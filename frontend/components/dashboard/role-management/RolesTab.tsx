"use client"

import { Role } from "./types"
import RoleCard from "./RoleCard"

interface RolesTabProps {
  roles: Role[]
  getPermissionIcon: (permissionId: string) => React.ReactNode
  getPermissionName: (permissionId: string) => string
}

export default function RolesTab({
  roles,
  getPermissionIcon,
  getPermissionName
}: RolesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            getPermissionIcon={getPermissionIcon}
            getPermissionName={getPermissionName}
          />
        ))}
      </div>
    </div>
  )
}

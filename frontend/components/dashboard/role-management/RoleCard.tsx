"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { Role } from "./types"

interface RoleCardProps {
  role: Role
  getPermissionIcon: (permissionId: string) => React.ReactNode
  getPermissionName: (permissionId: string) => string
}

export default function RoleCard({
  role,
  getPermissionIcon,
  getPermissionName
}: RoleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Geist, sans-serif' }}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {role.name}
          </div>
          <Badge variant="outline">{role.userCount} users</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
          {role.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
            Permissions ({role.permissions.length})
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
            {role.permissions.map(permissionId => (
              <div key={permissionId} className="flex items-center gap-2 text-sm">
                {getPermissionIcon(permissionId)}
                <span style={{ fontFamily: 'Geist, sans-serif' }}>
                  {getPermissionName(permissionId)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

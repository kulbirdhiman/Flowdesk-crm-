"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { Role } from "./types"

interface RoleOverviewCardsProps {
  roles: Role[]
}

export default function RoleOverviewCards({ roles }: RoleOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map(role => (
        <Card key={role.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
              {role.name}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
              {role.userCount}
            </div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
              {role.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

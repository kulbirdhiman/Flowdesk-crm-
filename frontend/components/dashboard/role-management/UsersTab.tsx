"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Edit, Eye, UserCheck, UserX } from "lucide-react"
import { User, Role } from "./types"

interface UsersTabProps {
  users: User[]
  roles: Role[]
  onUpdateUserRole: (userId: string, newRole: string) => void
  onToggleUserStatus: (userId: string) => void
}

export default function UsersTab({
  users,
  roles,
  onUpdateUserRole,
  onToggleUserStatus
}: UsersTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                        {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(value) => onUpdateUserRole(user.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>
                      {user.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status === 'active'}
                        onCheckedChange={() => onToggleUserStatus(user.id)}
                      />
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? (
                          <><UserCheck className="h-3 w-3 mr-1" /> Active</>
                        ) : (
                          <><UserX className="h-3 w-3 mr-1" /> Inactive</>
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

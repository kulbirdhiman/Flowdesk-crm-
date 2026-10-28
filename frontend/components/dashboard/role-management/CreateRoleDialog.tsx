"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Role, Permission } from "./types"

interface CreateRoleDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newRole: Partial<Role>
  setNewRole: (role: Partial<Role>) => void
  groupedPermissions: Record<string, Permission[]>
  onCreateRole: () => void
}

export default function CreateRoleDialog({
  isOpen,
  onOpenChange,
  newRole,
  setNewRole,
  groupedPermissions,
  onCreateRole
}: CreateRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Geist, sans-serif' }}>Create New Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRole.name || ''}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Input
                id="roleDescription"
                value={newRole.description || ''}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Enter role description"
              />
            </div>
          </div>
          
          <div>
            <Label>Permissions</Label>
            <div className="max-h-60 overflow-y-auto border rounded-md p-4 space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-medium mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={newRole.permissions?.includes(permission.id) || false}
                          onCheckedChange={(checked) => {
                            setNewRole({
                              ...newRole,
                              permissions: checked
                                ? [...(newRole.permissions || []), permission.id]
                                : (newRole.permissions || []).filter(p => p !== permission.id)
                            });
                          }}
                        />
                        <Label htmlFor={permission.id} className="flex items-center gap-2 cursor-pointer">
                          {permission.icon}
                          <span>{permission.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={onCreateRole} className="w-full">
            Create Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

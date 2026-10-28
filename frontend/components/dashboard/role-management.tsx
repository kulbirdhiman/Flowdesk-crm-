"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield } from "lucide-react";
import RoleManagementHeader from "./role-management/RoleManagementHeader";
import RoleOverviewCards from "./role-management/RoleOverviewCards";
import UsersTab from "./role-management/UsersTab";
import RolesTab from "./role-management/RolesTab";
import CreateUserDialog from "./role-management/CreateUserDialog";
import CreateRoleDialog from "./role-management/CreateRoleDialog";
import LoadingSkeleton from "./role-management/LoadingSkeleton";
import { User, Role, DEFAULT_ROLES, groupedPermissions } from "./role-management/types";
import { 
  fetchUsers, 
  getRolePermissions, 
  updateRoleUserCounts, 
  getPermissionIcon, 
  getPermissionName,
  createUser,
  createRole,
  updateUserRole,
  toggleUserStatus
} from "./role-management/utils";

export function RoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [loading, setLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [newRole, setNewRole] = useState<Partial<Role>>({});

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
      const updatedRoles = updateRoleUserCounts(usersData, roles);
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const userData = await createUser(newUser, roles);
      setUsers(prev => [...prev, userData]);
      setNewUser({});
      setIsUserDialogOpen(false);
      
      // Update role user counts
      const updatedRoles = updateRoleUserCounts([...users, userData], roles);
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCreateRole = async () => {
    try {
      const roleData = await createRole(newRole);
      setRoles(prev => [...prev, roleData]);
      setNewRole({});
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRoleId: string) => {
    try {
      await updateUserRole(userId, newRoleId, roles);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRoleId, permissions: getRolePermissions(newRoleId, roles) }
          : user
      ));
      
      // Update role user counts
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, role: newRoleId, permissions: getRolePermissions(newRoleId, roles) }
          : user
      );
      const updatedRoles = updateRoleUserCounts(updatedUsers, roles);
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <RoleManagementHeader
        onAddUser={() => setIsUserDialogOpen(true)}
        onCreateRole={() => setIsRoleDialogOpen(true)}
      />

      {/* Role Overview Cards */}
      <RoleOverviewCards roles={roles} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <UsersTab
            users={users}
            roles={roles}
            onUpdateUserRole={handleUpdateUserRole}
            onToggleUserStatus={handleToggleUserStatus}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <RolesTab
            roles={roles}
            getPermissionIcon={getPermissionIcon}
            getPermissionName={getPermissionName}
          />
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        roles={roles}
        onCreateUser={handleCreateUser}
      />

      {/* Create Role Dialog */}
      <CreateRoleDialog
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        newRole={newRole}
        setNewRole={setNewRole}
        groupedPermissions={groupedPermissions}
        onCreateRole={handleCreateRole}
      />
    </div>
  );
}
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { isDemoMode } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'admin' | 'employee' | 'hr';

interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const checkUserRole = () => {
      try {
        // First check for demo mode
        const demoRole = document.cookie
          .split('; ')
          .find(row => row.startsWith('demo_user_role='))
          ?.split('=')[1];
        
        if (isDemoMode && demoRole) {
          setUserRole(demoRole as UserRole);
        } else if (user) {
          // Fallback to real authenticated user's role
          setUserRole(user.role as UserRole);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [user, authLoading]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}

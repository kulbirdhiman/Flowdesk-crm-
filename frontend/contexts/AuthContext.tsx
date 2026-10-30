"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { isDemoMode } from '@/lib/apiClient';
import { clearAppStorage } from "@/lib/localDb";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  full_name: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGettingUser, setIsGettingUser] = useState(false);

  // Look up the employee profile for a signed-in account and work out its role.
  const loadProfile = async (authUser: { id: string; email?: string; created_at: string }): Promise<User | null> => {
    const { data: employeeData, error } = await supabase
      .from('Employee Directory')
      .select('full_name, job_title, department')
      .eq('official_email', authUser.email)
      .single();

    if (error || !employeeData) {
      console.error('No employee record found for', authUser.email);
      return null;
    }

    // Roles come from the authenticated backend, never from editable job titles.
    const title = String(employeeData.job_title || '').toLowerCase();
    const role = (isDemoMode ? (title.includes('hr') ? 'hr' : /admin|ceo|manager/.test(title) ? 'admin' : 'employee') : (authUser as any).app_metadata?.role || 'employee') as 'admin' | 'hr' | 'employee';

    return {
      id: authUser.id,
      email: authUser.email!,
      role,
      full_name: employeeData.full_name || authUser.email!,
      created_at: authUser.created_at
    };
  };

  // Get current user and role
  const getCurrentUser = async () => {
    if (isGettingUser) return;

    try {
      setIsGettingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session ? await loadProfile(session.user) : null);
    } catch (error) {
      console.error('Error getting current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setIsGettingUser(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'No user data returned' };
      }

      const userData = await loadProfile(data.user);
      if (!userData) {
        await supabase.auth.signOut();
        return { user: null, error: 'No employee record found' };
      }

      setUser(userData);
      setLoading(false);
      return { user: userData, error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { user: null, error: error.message || 'An error occurred during sign in' };
    }
  };

  // Clear attendance and user data from local storage
  const clearUserData = () => {
    try {
      // Clear specific attendance and user data
      localStorage.removeItem('offline-attendance');
      localStorage.removeItem('attendance-data');
      localStorage.removeItem('user-data');
      localStorage.removeItem('employee-data');
      localStorage.removeItem('demo-mode');
      
      // Clear any other app-specific data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('attendance') || key.includes('employee') || key.includes('user'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('User and attendance data cleared from local storage');
    } catch (error) {
      console.error('Error clearing local storage:', error);
      // Fallback to clear all
      clearAppStorage();
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      // Clear user and attendance data from local storage
      clearUserData();
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // HR permissions
    if (user.role === 'hr') {
      return ['view_employees', 'manage_attendance', 'view_reports'].includes(permission);
    }
    
    // Employee permissions
    if (user.role === 'employee') {
      return ['view_profile', 'manage_tasks', 'view_leads'].includes(permission);
    }
    
    return false;
  };

  // Listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (isMounted) {
        console.log('Initializing auth...');
        await getCurrentUser();
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        }
        // Removed SIGNED_IN handler to prevent loops - signIn function handles this
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

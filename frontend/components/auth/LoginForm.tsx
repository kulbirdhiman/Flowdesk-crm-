"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Building2, ShieldCheck, UserRound, Users, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/lib/seedData';
import { resetLocalDb } from '@/lib/localDb';

const ROLE_ICONS = { admin: ShieldCheck, employee: UserRound, hr: Users };

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      console.log('Starting login process for:', data.email);
      const { user, error } = await signIn(data.email, data.password);
      
      console.log('SignIn response:', { user, error });
      
      if (error) {
        console.error('Login error:', error);
        // Handle specific error cases
        if (error.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else if (error.includes('Email not confirmed')) {
          toast.error('Please check your email and confirm your account before signing in.');
        } else if (error.includes('Too many requests')) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          toast.error(error);
        }
        setIsLoading(false);
        return;
      }

      if (user) {
        console.log('Login successful! User:', user);
        toast.success(`Welcome back, ${user.full_name}!`);
        
        // Immediate redirect based on user role
        let redirectUrl = '';
        if (user.role === 'admin') {
          redirectUrl = '/dashboard';
          console.log('Admin user - redirecting to dashboard');
        } else if (user.role === 'hr') {
          redirectUrl = '/dashboard/attendance/hr';
          console.log('HR user - redirecting to HR dashboard');
        } else {
          redirectUrl = '/employee';
          console.log('Employee user - redirecting to employee portal');
        }
        
        console.log('Redirecting to:', redirectUrl);
        
        // Small delay to ensure auth state is properly set
        setTimeout(() => {
          router.push(redirectUrl);
        }, 100);
        
      } else {
        console.log('No user object received from signIn');
        toast.error('Login failed - no user data received');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error(error.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };

  const loginAs = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setValue('email', account.email);
    setValue('password', account.password);
    onSubmit({ email: account.email, password: account.password });
  };

  const resetDemoData = () => {
    if (!window.confirm('Restore the original demo data? Changes made in this browser will be lost.')) return;
    resetLocalDb();
    toast.success('Demo data restored');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Company CRM</CardTitle>
        <CardDescription>
          Sign in to access your company dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Company Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your.email@company.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In to Company CRM'
            )}
          </Button>

          {/* Demo profiles: which email opens which role */}
          <div className="mt-4 space-y-3 rounded-md border bg-muted/40 p-3">
            <div className="text-center">
              <p className="text-sm font-semibold">Demo accounts</p>
              <p className="text-xs text-muted-foreground">
                Click a profile to sign in, or type its email. Password for all: <span className="font-mono font-semibold text-foreground">{DEMO_PASSWORD}</span>
              </p>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = ROLE_ICONS[account.role];
                return (
                  <button
                    key={account.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => loginAs(account)}
                    className="flex w-full items-start gap-3 rounded-md border bg-background p-3 text-left transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="text-sm font-semibold">{account.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">{account.email}</span>
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {account.name}, {account.title}. {account.access}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              All data is sample data saved in this browser only.
            </p>
            <button
              type="button"
              onClick={resetDemoData}
              className="mx-auto flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Reset demo data
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

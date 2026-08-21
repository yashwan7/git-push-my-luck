'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface AuthUserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AuthUserProfile | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | Error | null; isPlaceholder?: boolean }>;
  signInWithDemo: (demoUser?: Partial<AuthUserProfile>, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_DEMO_KEY = 'nayan_demo_user_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isSupabaseConfigured = 
    Boolean(supabaseUrl) && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://');

  const extractProfile = (userObj: User | null): AuthUserProfile | null => {
    if (!userObj) return null;
    return {
      id: userObj.id,
      email: userObj.email,
      fullName: userObj.user_metadata?.full_name || userObj.user_metadata?.name || userObj.email?.split('@')[0] || 'NAYAN User',
      avatarUrl: userObj.user_metadata?.avatar_url || userObj.user_metadata?.picture,
      isDemo: false,
    };
  };

  useEffect(() => {
    // 1. Check if Supabase session is active
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setProfile(extractProfile(currentSession.user));
          setIsLoading(false);
          return;
        }
        checkDemoFallback();
      }).catch((err) => {
        console.warn('Supabase getSession error:', err);
        checkDemoFallback();
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, updatedSession) => {
          if (updatedSession?.user) {
            setSession(updatedSession);
            setUser(updatedSession.user);
            setProfile(extractProfile(updatedSession.user));
          } else {
            checkDemoFallback();
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      checkDemoFallback();
    }
  }, [isSupabaseConfigured]);

  const checkDemoFallback = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_DEMO_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AuthUserProfile;
          setProfile(parsed);
          setUser({
            id: parsed.id,
            app_metadata: {},
            user_metadata: { full_name: parsed.fullName, avatar_url: parsed.avatarUrl },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: parsed.email,
          } as unknown as User);
        }
      }
    } catch (e) {
      console.warn('Demo session check error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectPath = redirectTo || '/dashboard';
      const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;

      if (!isSupabaseConfigured) {
        console.warn('Supabase URL is placeholder in .env.local');
        return { 
          error: new Error('Supabase project credentials not configured in .env.local yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or use 1-Click Demo Login below.'),
          isPlaceholder: true 
        };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth sign-in error:', error);
        return { error };
      }

      if (data?.url && typeof window !== 'undefined') {
        window.location.href = data.url;
      }

      return { error: null };
    } catch (err: any) {
      console.error('Unexpected Google OAuth error:', err);
      return { 
        error: err as Error, 
        isPlaceholder: !isSupabaseConfigured 
      };
    }
  };

  const signInWithDemo = async (demoUser?: Partial<AuthUserProfile>, redirectTo?: string) => {
    const demoProfile: AuthUserProfile = {
      id: demoUser?.id || 'nayan_demo_ramesh_4821',
      email: demoUser?.email || 'ramesh.kumar@gmail.com',
      fullName: demoUser?.fullName || 'Ramesh Kumar',
      avatarUrl: demoUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemo: true,
    };

    setProfile(demoProfile);
    setUser({
      id: demoProfile.id,
      app_metadata: {},
      user_metadata: { full_name: demoProfile.fullName, avatar_url: demoProfile.avatarUrl },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: demoProfile.email,
    } as unknown as User);

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, JSON.stringify(demoProfile));
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_DEMO_KEY);
      }
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Supabase sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isSupabaseConfigured,
        signInWithGoogle,
        signInWithDemo,
        signOut,
        isAuthenticated: !!user || !!profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

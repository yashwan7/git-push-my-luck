'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface AuthUserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AuthUserProfile | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  skipAuth: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const extractProfile = (userObj: User | null): AuthUserProfile | null => {
    if (!userObj) return null;
    return {
      id: userObj.id,
      email: userObj.email,
      fullName:
        userObj.user_metadata?.full_name ||
        userObj.user_metadata?.name ||
        userObj.email?.split('@')[0] ||
        'ANUKOOL User',
      avatarUrl:
        userObj.user_metadata?.avatar_url ||
        userObj.user_metadata?.picture,
    };
  };

  useEffect(() => {
    let isMounted = true;

    // Check guest skip state from localStorage
    if (typeof window !== 'undefined') {
      const skipped = localStorage.getItem('anukool_auth_skipped') === 'true';
      if (skipped) {
        setIsGuest(true);
        setProfile({
          id: 'guest-citizen',
          fullName: 'Guest Citizen',
          email: 'guest@anukool.local',
        });
      }
    }

    // 1. Initial Session Retrieval
    supabase.auth.getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!isMounted) return;
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setProfile(extractProfile(currentSession.user));
          setIsGuest(false);
        }
      })
      .catch((err) => {
        console.error('Supabase getSession error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // 2. Real-time Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, updatedSession) => {
        if (!isMounted) return;
        if (updatedSession?.user) {
          setSession(updatedSession);
          setUser(updatedSession.user);
          setProfile(extractProfile(updatedSession.user));
          setIsGuest(false);
        } else {
          setSession(null);
          setUser(null);
          // Don't wipe guest profile if guest mode was active
          const skipped = typeof window !== 'undefined' && localStorage.getItem('anukool_auth_skipped') === 'true';
          if (!skipped) {
            setProfile(null);
            setIsGuest(false);
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const skipAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anukool_auth_skipped', 'true');
    }
    setIsGuest(true);
    setProfile({
      id: 'guest-citizen',
      fullName: 'Guest Citizen',
      email: 'guest@anukool.local',
    });
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectPath = redirectTo || '/dashboard';
      const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
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
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('anukool_auth_skipped');
      }
      setIsGuest(false);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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
        signInWithGoogle,
        signOut,
        skipAuth,
        isAuthenticated: !!user || isGuest,
        isGuest,
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

'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  supabase: SupabaseClient;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // The browser client is module-singleton, so useMemo gives us a stable reference
  // and useRef guarantees the listener is registered exactly once.
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const registeredRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isFirstLoadRef = useRef(true);

  const clearRetry = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = undefined;
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name,
          });
          // Profile found — stop retrying
          clearRetry();
          setLoading(false);
        } else if (isFirstLoadRef.current) {
          // Profile not found yet — only retry aggressively on first load
          // (this handles the race condition after signup)
          isFirstLoadRef.current = false;
          retryTimerRef.current = setTimeout(async () => {
            await refreshUser();
          }, 400);
        } else {
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        clearRetry();
        setLoading(false);
      }
    } catch {
      setUser(null);
      clearRetry();
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => clearRetry();
  }, []);

  useEffect(() => {
    refreshUser();

    if (registeredRef.current) return;
    registeredRef.current = true;

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      isFirstLoadRef.current = false;
      clearRetry();
      // Use a microtask to avoid running state updates during render
      setTimeout(() => { refreshUser(); }, 0);
    });

    return () => {
      listener.subscription.unsubscribe();
      registeredRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, supabase, refreshUser }}>
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

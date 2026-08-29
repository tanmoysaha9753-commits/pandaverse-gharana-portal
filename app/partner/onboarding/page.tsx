'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function PartnerOnboarding() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'partner')) {
      router.push('/login');
    }
    if (!loading && user) {
      router.push('/partner/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pandaverse-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50">
      <div className="text-center">
        <div className="animate-pulse text-lg text-stone-600">Setting up your partner portal...</div>
      </div>
    </div>
  );
}

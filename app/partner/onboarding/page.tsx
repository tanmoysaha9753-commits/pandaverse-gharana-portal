'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function PartnerOnboarding() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Not logged in at all
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // If user has no profile yet, poll briefly for it
    if (!retrying) {
      setRetrying(true);
    }
  }, [user, loading, retrying]);

  // Poll for profile if still missing
  useEffect(() => {
    if (!retrying || !user) return;

    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      // We rely on the AuthProvider listener to update `user` when the profile appears
      // After max attempts, just redirect to login
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        router.push('/login?onboarding=profile_not_found');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [retrying, user, router]);

  if (loading || retrying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pandaverse-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-stone-600">Setting up your partner portal...</p>
          <p className="text-sm text-stone-400 mt-2">This will just take a moment.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50">
        <div className="text-center">
          <p className="text-lg text-stone-600">Please sign in to continue.</p>
          <Link href="/login" className="text-pandaverse-700 hover:text-pandaverse-800 font-medium mt-4 inline-block">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // User exists with profile — redirect to dashboard
  router.push('/partner/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50">
      <div className="text-center">
        <div className="animate-pulse text-lg text-stone-600">Welcome! Taking you to your dashboard...</div>
      </div>
    </div>
  );
}

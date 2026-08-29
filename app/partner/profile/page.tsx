import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import PartnerLayout from '@/components/PartnerLayout';

export default async function PartnerProfile() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || profile.role !== 'partner') redirect('/login');

  const { data: partner } = await supabase.from('partners').select('*').eq('profile_id', user.id).maybeSingle();

  if (!partner) {
    return (
      <PartnerLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-stone-900">No profile yet</h1>
          <p className="text-stone-600 mt-2">Please complete your partner profile.</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">Account Information</h2>
          <div className="space-y-3">
            <Row label="Full Name" value={profile.full_name} />
            <Row label="Email" value={profile.email} />
            <Row label="Phone" value={profile.phone || '—'} />
            <Row label="Member Since" value={new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">Shop Information</h2>
          <div className="space-y-3">
            <Row label="Shop Name" value={partner.shop_name} />
            <Row label="Shop Type" value={partner.shop_type || '—'} />
            <Row label="Village/Town" value={partner.village_town || '—'} />
            <Row label="District" value={partner.district || '—'} />
            <Row label="State" value={partner.state || '—'} />
            <Row label="Country" value={partner.country || 'India'} />
            <Row label="Years in Business" value={String(partner.years_in_business || 0)} />
            {partner.introduction && (
              <div>
                <p className="text-sm text-stone-500">Introduction</p>
                <p className="text-stone-800 mt-1">{partner.introduction}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-stone-500 text-center">
          Need to update your profile? Contact Pandaverse support.
        </p>
      </div>
    </PartnerLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-stone-500 shrink-0">{label}</span>
      <span className="text-stone-800 text-right">{value}</span>
    </div>
  );
}

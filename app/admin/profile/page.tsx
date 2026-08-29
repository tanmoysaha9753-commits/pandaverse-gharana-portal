import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

export default async function AdminProfile() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Admin Profile</h1>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="space-y-3">
            <Row label="Full Name" value={profile.full_name} />
            <Row label="Email" value={profile.email} />
            <Row label="Phone" value={profile.phone || '—'} />
            <Row label="Role" value={profile.role} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone-500">{label}</span>
      <span className="text-stone-800 font-medium">{value}</span>
    </div>
  );
}

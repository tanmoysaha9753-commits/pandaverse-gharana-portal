import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import PartnerSearch from './PartnerSearch';

async function getPartners(searchQuery?: string) {
  const supabase = createServerSupabaseClient();

  // Get all partner IDs
  const { data: partners } = await supabase.from('partners').select('id, profile_id, shop_name, shop_type, village_town, district, state, country, years_in_business, created_at');

  if (!partners || partners.length === 0) return [];

  // Get profile data for all partners
  const profileIds = partners.map(p => p.profile_id);
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, phone').in('id', profileIds);

  // Get product counts for each partner
  const partnerIds = partners.map(p => p.id);
  const { data: products } = await supabase.from('products').select('partner_id, id');

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
  const productCountMap = new Map<string, number>();
  (products || []).forEach(p => {
    productCountMap.set(p.partner_id, (productCountMap.get(p.partner_id) || 0) + 1);
  });

  let result = partners.map((partner: any) => {
    const profile = profileMap.get(partner.profile_id);
    return {
      ...partner,
      profile,
      productCount: productCountMap.get(partner.id) || 0,
    };
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter((p: any) =>
      p.profile?.full_name?.toLowerCase().includes(q) ||
      p.shop_name?.toLowerCase().includes(q) ||
      p.village_town?.toLowerCase().includes(q) ||
      p.state?.toLowerCase().includes(q)
    );
  }

  return result;
}

export default async function AdminPartners({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  const partners = await getPartners(searchParams?.q);

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Gharana Partners</h1>
            <p className="text-stone-600 mt-1">{partners.length} registered partners</p>
          </div>
        </div>

        <PartnerSearch initialQuery={searchParams?.q || ''} />

        {partners.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
            {searchParams?.q ? 'No partners match your search.' : 'No partners registered yet.'}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {partners.map((partner: any) => (
              <Link key={partner.id} href={`/admin/partners/${partner.id}`} className="flex items-center justify-between p-5 hover:bg-stone-50">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900">{partner.profile?.full_name || 'Unknown'}</h3>
                  <p className="text-sm text-stone-500">{partner.shop_name}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {[partner.village_town, partner.district, partner.state].filter(Boolean).join(', ') || 'Location not specified'} • {partner.productCount} products
                  </p>
                </div>
                <span className="text-xs text-stone-400 shrink-0 ml-4">
                  {new Date(partner.created_at).toLocaleDateString('en-IN')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { Users, Package, FileImage, Film } from 'lucide-react';

async function getAdminStats() {
  const supabase = createServerSupabaseClient();

  const [{ count: partnerCount }, { count: productCount }, { count: imageCount }, { count: videoCount }] = await Promise.all([
    supabase.from('partners').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('media_assets').select('*', { count: 'exact', head: true }).eq('media_type', 'image'),
    supabase.from('media_assets').select('*', { count: 'exact', head: true }).eq('media_type', 'video'),
  ]);

  // Get recent products with partner info via separate queries to avoid complex join issues
  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, english_name, local_name, category, status, created_at, partner_id')
    .order('created_at', { ascending: false })
    .limit(10);

  const enrichedProducts: any[] = [];
  if (recentProducts && recentProducts.length > 0) {
    const partnerIds = [...new Set(recentProducts.map(p => p.partner_id))];
    const { data: partners } = await supabase
      .from('partners')
      .select('id, shop_name, profile_id')
      .in('id', partnerIds);

    const profileIds = partners?.map(p => p.profile_id).filter(Boolean) || [];
    const { data: profiles } = profileIds.length > 0
      ? await supabase.from('profiles').select('id, full_name').in('id', profileIds)
      : { data: [] };

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name]));
    const partnerMap = new Map((partners || []).map((p: any) => [p.id, p]));

    for (const product of recentProducts) {
      const partner = partnerMap.get(product.partner_id);
      const profileName = partner ? profileMap.get(partner.profile_id) : 'Unknown';
      enrichedProducts.push({
        ...product,
        shop_name: partner?.shop_name || 'Unknown',
        partner_name: profileName,
      });
    }
  }

  return {
    totalPartners: partnerCount || 0,
    totalProducts: productCount || 0,
    totalImages: imageCount || 0,
    totalVideos: videoCount || 0,
    recentProducts: enrichedProducts,
  };
}

export default async function AdminOverview() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  const stats = await getAdminStats();

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Platform Overview</h1>
        <p className="text-stone-600 mb-8">Welcome to the Pandaverse Admin Dashboard.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Partners" value={stats.totalPartners} color="blue" />
          <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="green" />
          <StatCard icon={FileImage} label="Total Images" value={stats.totalImages} color="purple" />
          <StatCard icon={Film} label="Total Videos" value={stats.totalVideos} color="pink" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Recent Product Submissions</h2>
          </div>
          {stats.recentProducts.length === 0 ? (
            <div className="p-12 text-center text-stone-500">No products uploaded yet.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {stats.recentProducts.map((product) => (
                <div key={product.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{product.english_name}</p>
                    <p className="text-sm text-stone-500">{product.shop_name} • {product.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-stone-900">{value}</p>
      <p className="text-sm text-stone-600">{label}</p>
    </div>
  );
}

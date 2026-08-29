import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

async function getAllProducts() {
  const supabase = createServerSupabaseClient();

  // Get products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (!products || products.length === 0) return [];

  // Enrich with partner + profile data via separate queries
  const partnerIds = [...new Set(products.map(p => p.partner_id))];
  const { data: partners } = await supabase
    .from('partners')
    .select('id, shop_name, state, profile_id')
    .in('id', partnerIds);

  const profileIds = partners?.map(p => p.profile_id).filter(Boolean) || [];
  const { data: profiles } = profileIds.length > 0
    ? await supabase.from('profiles').select('id, full_name').in('id', profileIds)
    : { data: [] };

  const partnerMap = new Map((partners || []).map(p => [p.id, p]));
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name]));

  return products.map((product) => {
    const partner = partnerMap.get(product.partner_id);
    return {
      ...product,
      shop_name: partner?.shop_name,
      state: partner?.state,
      partner_name: partner ? profileMap.get(partner.profile_id) : undefined,
    };
  });
}

export default async function AdminProducts() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  const products = await getAllProducts();

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">All Products</h1>
        <p className="text-stone-600 mb-6">Total: {products.length} products</p>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
            No products uploaded yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {products.map((product: any) => (
              <Link key={product.id} href={`/admin/content?product=${product.id}`} className="flex items-center justify-between p-5 hover:bg-stone-50">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900">{product.english_name}</h3>
                  <p className="text-sm text-stone-500">{product.shop_name || 'Unknown shop'} • {product.category} • ₹{product.price}</p>
                  <p className="text-xs text-stone-400 mt-1">{new Date(product.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {product.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

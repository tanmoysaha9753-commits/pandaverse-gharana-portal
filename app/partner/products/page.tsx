import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import PartnerLayout from '@/components/PartnerLayout';

async function getProducts(partnerId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function PartnerProducts() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || profile.role !== 'partner') redirect('/login');

  const { data: partner } = await supabase.from('partners').select('id').eq('profile_id', user.id).maybeSingle();
  if (!partner) redirect('/partner/onboarding');

  const products = await getProducts(partner.id);

  return (
    <PartnerLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">My Products</h1>
            <p className="text-stone-600 mt-1">All your uploaded products ({products.length})</p>
          </div>
          <Link href="/partner/upload" className="px-4 py-2 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-medium">
            + New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">No products yet</h3>
            <p className="text-stone-600 mb-6">Start by uploading your first product to share with Pandaverse.</p>
            <Link href="/partner/upload" className="px-6 py-3 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-medium">
              Upload First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {products.map((product: any) => (
              <Link key={product.id} href={`/partner/products/${product.id}`} className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900">{product.english_name}</h3>
                  <p className="text-sm text-stone-500">{product.local_name} • {product.category} • ₹{product.price}</p>
                  <p className="text-xs text-stone-400 mt-1">{new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {product.status === 'submitted' ? 'Submitted' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}

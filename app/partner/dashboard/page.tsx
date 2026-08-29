import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { PartnerLayout } from '@/components/PartnerLayout';
import { Package, Upload, FileImage, Film, Clock } from 'lucide-react';

async function getPartnerData(partnerId: string) {
  const supabase = createServerSupabaseClient();

  const [productsRes, imagesRes, videosRes, draftRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }).eq('partner_id', partnerId),
    supabase.from('media_assets').select('id', { count: 'exact' }).eq('partner_id', partnerId).eq('media_type', 'image'),
    supabase.from('media_assets').select('id', { count: 'exact' }).eq('partner_id', partnerId).eq('media_type', 'video'),
    supabase.from('products').select('id', { count: 'exact' }).eq('partner_id', partnerId).eq('status', 'draft'),
  ]);

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, local_name, english_name, category, status, created_at')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalProducts: productsRes.count || 0,
    totalImages: imagesRes.count || 0,
    totalVideos: videosRes.count || 0,
    draftProducts: draftRes.count || 0,
    recentProducts: recentProducts || [],
  };
}

export default async function PartnerDashboard() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || profile.role !== 'partner') {
    redirect('/login');
  }

  const { data: partner } = await supabase.from('partners').select('*').eq('profile_id', user.id).maybeSingle();
  if (!partner) {
    redirect('/partner/onboarding');
  }

  const stats = await getPartnerData(partner.id);

  return (
    <PartnerLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">
            Welcome back, {profile.full_name.split(' ')[0]}
          </h1>
          <p className="text-stone-600 mt-1">{partner.shop_name}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <Package className="w-8 h-8 text-pandaverse-600 mb-2" />
            <p className="text-2xl font-bold text-stone-900">{stats.totalProducts}</p>
            <p className="text-sm text-stone-600">Total Products</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <FileImage className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-stone-900">{stats.totalImages}</p>
            <p className="text-sm text-stone-600">Photos Uploaded</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <Film className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-stone-900">{stats.totalVideos}</p>
            <p className="text-sm text-stone-600">Videos Uploaded</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <Clock className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-stone-900">{stats.draftProducts}</p>
            <p className="text-sm text-stone-600">Draft Products</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/partner/upload" className="px-6 py-3 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-medium flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Product
            </a>
            <a href="/partner/products" className="px-6 py-3 bg-white border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-50 font-medium flex items-center gap-2">
              <Package className="w-5 h-5" />
              View My Products
            </a>
            <a href="/partner/guide" className="px-6 py-3 bg-white border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-50 font-medium flex items-center gap-2">
              Read Pandaverse Guide
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">Recently Uploaded Products</h2>
          {stats.recentProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 mb-4">No products uploaded yet</p>
              <a href="/partner/upload" className="text-pandaverse-700 hover:text-pandaverse-800 font-medium">
                Upload your first product →
              </a>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {stats.recentProducts.map((product: any) => (
                <div key={product.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{product.english_name}</p>
                    <p className="text-sm text-stone-500">{product.local_name} • {product.category} • ₹{product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {product.status === 'submitted' ? 'Submitted' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PartnerLayout>
  );
}

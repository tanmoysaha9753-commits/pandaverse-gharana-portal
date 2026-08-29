import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Film } from 'lucide-react';

async function getPartnerDetail(partnerId: string) {
  const supabase = createServerSupabaseClient();

  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .maybeSingle();

  if (!partner) return null;

  // Get profile data separately
  const { data: profile } = partner.profile_id
    ? await supabase.from('profiles').select('id, full_name, email').eq('id', partner.profile_id).maybeSingle()
    : { data: null };

  const [{ data: products }, { data: images }, { data: videos }] = await Promise.all([
    supabase.from('products').select('*').eq('partner_id', partnerId).order('created_at', { ascending: false }),
    supabase.from('media_assets').select('*').eq('partner_id', partnerId).eq('media_type', 'image'),
    supabase.from('media_assets').select('*').eq('partner_id', partnerId).eq('media_type', 'video'),
  ]);

  // Generate signed URLs for images
  const imagesWithUrls = await Promise.all(
    (images || []).map(async (img) => {
      const { data } = await supabase.storage.from('product-images').createSignedUrl(img.storage_path, 3600);
      return { ...img, signed_url: data?.signedUrl || null };
    })
  );

  // Generate signed URLs for videos
  const videosWithUrls = await Promise.all(
    (videos || []).map(async (vid) => {
      const { data } = await supabase.storage.from('product-videos').createSignedUrl(vid.storage_path, 3600);
      return { ...vid, signed_url: data?.signedUrl || null };
    })
  );

  return {
    partner: { ...partner, profile },
    products: products || [],
    images: imagesWithUrls,
    videos: videosWithUrls,
  };
}

export default async function AdminPartnerDetail({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  const data = await getPartnerDetail(params.id);
  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-stone-900">Partner not found</h1>
          <Link href="/admin/partners" className="text-pandaverse-700 hover:text-pandaverse-800 mt-4 inline-block">← Back to Partners</Link>
        </div>
      </AdminLayout>
    );
  }

  const { partner, products, images, videos } = data;

  return (
    <AdminLayout>
      <div>
        <Link href="/admin/partners" className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Partners
        </Link>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-stone-900">{(partner as any).profile?.full_name || partner.shop_name}</h1>
          <p className="text-stone-600 mt-1">{partner.shop_name}</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div><span className="text-stone-500">Location:</span> <span className="text-stone-800">{[partner.village_town, partner.district, partner.state].filter(Boolean).join(', ') || '—'}</span></div>
            <div><span className="text-stone-500">Type:</span> <span className="text-stone-800">{partner.shop_type || '—'}</span></div>
            <div><span className="text-stone-500">Joined:</span> <span className="text-stone-800">{new Date(partner.created_at).toLocaleDateString('en-IN')}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
            <p className="text-3xl font-bold text-pandaverse-700">{products.length}</p>
            <p className="text-sm text-stone-600">Products</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
            <p className="text-3xl font-bold text-blue-600">{images.length}</p>
            <p className="text-sm text-stone-600">Images</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
            <p className="text-3xl font-bold text-purple-600">{videos.length}</p>
            <p className="text-sm text-stone-600">Videos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 mb-6">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold">Products ({products.length})</h2>
          </div>
          {products.length === 0 ? (
            <div className="p-8 text-center text-stone-500">No products uploaded.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {products.map((product: any) => (
                <Link key={product.id} href={`/admin/content?partner=${partner.id}&product=${product.id}`} className="block">
                  <div className="p-5 flex items-center justify-between hover:bg-stone-50">
                    <div>
                      <h3 className="font-semibold text-stone-900">{product.english_name}</h3>
                      <p className="text-sm text-stone-500">{product.local_name} • {product.category} • ₹{product.price}</p>
                      <p className="text-xs text-stone-400 mt-1">{new Date(product.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {product.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">All Photos ({images.length})</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
                  {img.signed_url ? (
                    <Image src={img.signed_url} alt={img.file_name} fill className="object-cover" sizes="150px" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400 text-xs p-2 text-center">{img.file_name}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-xl font-semibold mb-4">All Videos ({videos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {videos.map((vid) => (
                <div key={vid.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Film className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 text-sm truncate">{vid.file_name}</p>
                    <p className="text-xs text-stone-500">{vid.media_category}</p>
                  </div>
                  {vid.signed_url ? (
                    <a href={vid.signed_url} target="_blank" rel="noopener noreferrer" className="text-xs text-pandaverse-700 ml-auto shrink-0">View</a>
                  ) : (
                    <span className="text-xs text-stone-400 ml-auto">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

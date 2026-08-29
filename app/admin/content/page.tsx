import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { Film } from 'lucide-react';

async function getContentLibrary(partnerId?: string, productId?: string) {
  const supabase = createServerSupabaseClient();

  // Query partners
  let partnersQuery = supabase.from('partners').select('id, shop_name, profile_id');
  if (partnerId) partnersQuery = partnersQuery.eq('id', partnerId);
  const { data: partners } = await partnersQuery;

  // Enrich partners with profile data
  let enrichedPartners: any[] = (partners || []).map(p => ({ ...p, profile_name: null }));
  if (enrichedPartners.length > 0) {
    const profileIds = enrichedPartners.map(p => p.profile_id).filter(Boolean);
    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', profileIds);
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name]));
      enrichedPartners = enrichedPartners.map(p => ({
        ...p,
        profile_name: profileMap.get(p.profile_id) || null,
      }));
    }
  }

  // Query products
  let productsQuery = supabase.from('products').select('*');
  if (productId) productsQuery = productsQuery.eq('id', productId);
  else if (partnerId) productsQuery = productsQuery.eq('partner_id', partnerId);
  const { data: products } = await productsQuery;

  // Get media assets for those products
  const productIds = (products || []).map((p: any) => p.id);
  let images: any[] = [];
  let videos: any[] = [];

  if (productId || productIds.length > 0) {
    let imagesQuery = supabase.from('media_assets').select('*').eq('media_type', 'image');
    let videosQuery = supabase.from('media_assets').select('*').eq('media_type', 'video');
    if (productId) {
      imagesQuery = imagesQuery.eq('product_id', productId);
      videosQuery = videosQuery.eq('product_id', productId);
    } else if (productIds.length > 0) {
      imagesQuery = imagesQuery.in('product_id', productIds);
      videosQuery = videosQuery.in('product_id', productIds);
    }
    const [imgRes, vidRes] = await Promise.all([imagesQuery, videosQuery]);
    images = imgRes.data || [];
    videos = vidRes.data || [];
  }

  // Generate signed URLs for images
  const imagesWithUrls = await Promise.all(
    images.map(async (img) => {
      const { data } = await supabase.storage.from('product-images').createSignedUrl(img.storage_path, 3600);
      return { ...img, signed_url: data?.signedUrl || null };
    })
  );

  // Generate signed URLs for videos
  const videosWithUrls = await Promise.all(
    videos.map(async (vid) => {
      const { data } = await supabase.storage.from('product-videos').createSignedUrl(vid.storage_path, 3600);
      return { ...vid, signed_url: data?.signedUrl || null };
    })
  );

  return { partners: enrichedPartners, products: products || [], images: imagesWithUrls, videos: videosWithUrls };
}

export default async function AdminContentLibrary({ searchParams }: { searchParams: { partner?: string; product?: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/partner/dashboard');

  const { partners, products, images, videos } = await getContentLibrary(searchParams.partner, searchParams.product);

  const selectedPartner = searchParams.partner;
  const selectedProduct = searchParams.product;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Content Library</h1>

        {/* Partner Selector */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Select Partner</h2>
          <div className="flex flex-wrap gap-2">
            {partners.map((p: any) => (
              <Link
                key={p.id}
                href={`/admin/content?partner=${p.id}${selectedProduct ? `&product=${selectedProduct}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPartner === p.id ? 'bg-pandaverse-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
              >
                {p.shop_name}
              </Link>
            ))}
            {partners.length === 0 && <p className="text-stone-500">No partners found.</p>}
          </div>
        </div>

        {selectedPartner && (
          <>
            {/* Product Selector */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Select Product</h2>
              <div className="flex flex-wrap gap-2">
                {products.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/admin/content?partner=${selectedPartner}&product=${p.id}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedProduct === p.id ? 'bg-pandaverse-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                  >
                    {p.english_name}
                  </Link>
                ))}
                {products.length === 0 && <p className="text-stone-500">No products for this partner.</p>}
              </div>
            </div>

            {/* Content Display */}
            {selectedProduct && (() => {
              const product = products.find((p: any) => p.id === selectedProduct);
              if (!product) return null;

              const productImages = images.filter((i: any) => i.product_id === selectedProduct);
              const productVideos = videos.filter((v: any) => v.product_id === selectedProduct);

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Product Information</h2>
                    <div className="space-y-3">
                      <Row label="Product Name" value={`${product.english_name} (${product.local_name || ''})`} />
                      <Row label="Category" value={product.category} />
                      <Row label="Price" value={`₹${product.price}`} />
                      <Row label="Description" value={product.description || ''} />
                      <Row label="Status" value={product.status} />
                      <Row label="Created" value={new Date(product.created_at).toLocaleDateString('en-IN')} />
                    </div>
                  </div>

                  {productImages.length > 0 && (
                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                      <h2 className="text-xl font-semibold text-stone-900 mb-4">Photos ({productImages.length})</h2>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {productImages.map((img: any) => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
                            {img.signed_url ? (
                              <Image src={img.signed_url} alt={img.file_name} fill className="object-cover" sizes="150px" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-stone-400 text-xs p-2 text-center">{img.file_name}</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">{img.media_category}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {productVideos.length > 0 && (
                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                      <h2 className="text-xl font-semibold text-stone-900 mb-4">Videos ({productVideos.length})</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {productVideos.map((vid: any) => (
                          <div key={vid.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Film className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
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
              );
            })()}
          </>
        )}
      </div>
    </AdminLayout>
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

import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import PartnerLayout from '@/components/PartnerLayout';
import { Film, ArrowLeft } from 'lucide-react';

async function getProductDetail(productId: string, partnerId: string) {
  const supabase = createServerSupabaseClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('partner_id', partnerId)
    .maybeSingle();

  if (!product) return null;

  const [storyRes, makerRes, imagesRes, videosRes] = await Promise.all([
    supabase.from('product_stories').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('maker_details').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('media_assets').select('*').eq('product_id', productId).eq('media_type', 'image').order('uploaded_at', { ascending: true }),
    supabase.from('media_assets').select('*').eq('product_id', productId).eq('media_type', 'video').order('uploaded_at', { ascending: true }),
  ]);
  const story = storyRes.data;
  const maker = makerRes.data;
  const images = imagesRes.data || [];
  const videos = videosRes.data || [];

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

  return { product, story, maker, images: imagesWithUrls, videos: videosWithUrls };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || profile.role !== 'partner') redirect('/login');

  const { data: partner } = await supabase.from('partners').select('id').eq('profile_id', user.id).maybeSingle();
  if (!partner) redirect('/partner/onboarding');

  const data = await getProductDetail(params.id, partner.id);
  if (!data || !data.product) {
    return (
      <PartnerLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Product not found</h1>
          <Link href="/partner/products" className="text-pandaverse-700 hover:text-pandaverse-800">← Back to My Products</Link>
        </div>
      </PartnerLayout>
    );
  }

  const { product, story, maker, images, videos } = data;

  return (
    <PartnerLayout>
      <div className="max-w-4xl mx-auto">
        <Link href="/partner/products" className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to My Products
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">{product.english_name}</h1>
            <p className="text-lg text-stone-600 mt-1">{product.local_name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">{product.category}</span>
              <span className="text-lg font-semibold text-pandaverse-700">₹{product.price}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {product.status === 'submitted' ? 'Submitted' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-3">Description</h2>
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Product Story */}
        {story && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Product Story</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {story.special_reason && <Detail label="What makes it special" value={story.special_reason} />}
              {story.materials && <Detail label="Materials" value={story.materials} />}
              {story.craft_technique && <Detail label="Craft Technique" value={story.craft_technique} />}
              {story.production_time && <Detail label="Production Time" value={story.production_time} />}
              {story.traditional_use && <Detail label="Traditional Use" value={story.traditional_use} />}
              {story.cultural_significance && <Detail label="Cultural Significance" value={story.cultural_significance} />}
              {story.additional_story && <Detail label="Additional Story" value={story.additional_story} />}
            </div>
          </div>
        )}

        {/* Maker Details */}
        {maker && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Maker Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Detail label="Name" value={maker.full_name} />
              {maker.age && <Detail label="Age" value={String(maker.age)} />}
              {maker.location && <Detail label="Location" value={maker.location} />}
              {maker.experience && <Detail label="Experience" value={maker.experience} />}
              {maker.taught_by && <Detail label="Taught By" value={maker.taught_by} />}
              {maker.family_tradition && <Detail label="Family Tradition" value={maker.family_tradition} />}
              {maker.generations && <Detail label="Generations" value={`${maker.generations}`} />}
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {maker.thoughts && <Detail label="Thoughts" value={maker.thoughts} />}
              {maker.feelings && <Detail label="Feelings" value={maker.feelings} />}
              {maker.memories && <Detail label="Memories" value={maker.memories} />}
              {maker.personal_message && <Detail label="Personal Message" value={maker.personal_message} />}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Photographs ({images.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
                  {img.signed_url ? (
                    <Image src={img.signed_url} alt={img.file_name} fill className="object-cover" sizes="300px" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400 text-xs p-2 text-center">
                      {img.file_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Videos ({videos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div key={vid.id} className="border border-stone-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Film className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">{vid.file_name}</p>
                    <p className="text-sm text-stone-500">{vid.media_category}</p>
                    {vid.signed_url ? (
                      <a href={vid.signed_url} target="_blank" rel="noopener noreferrer" className="text-sm text-pandaverse-700 hover:text-pandaverse-800">
                        View Video →
                      </a>
                    ) : (
                      <span className="text-sm text-stone-400">Upload pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="bg-stone-50 rounded-lg p-3">
      <p className="text-xs text-stone-500 mb-1">{label}</p>
      <p className="text-sm text-stone-800">{value}</p>
    </div>
  );
}

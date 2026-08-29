'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import PartnerLayout from '@/components/PartnerLayout';
import { ArrowRight, ArrowLeft, Upload, X, Film } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const categories = [
  'Saree', 'Dupatta', 'Shawl', 'Stole', 'Scarf', 'Kurta', 'Kurti',
  'Blouse', 'Lehenga', 'Salwar', 'Dress Material', 'Home Decor',
  'Wall Hanging', 'Cushion Cover', 'Table Runner', 'Bags',
  'Jewelry', 'Footwear', 'Textile Art', 'Embroidery', 'Block Print',
  'Handloom Fabric', 'Silk Product', 'Cotton Product', 'Wool Product', 'Other',
];

const imageCategories = [
  { key: 'hero', label: 'Hero Image (front view)' },
  { key: 'back', label: 'Back / Reverse Side' },
  { key: 'details', label: 'Detail Close-ups' },
  { key: 'maker', label: 'Maker Photo' },
  { key: 'workspace', label: 'Workspace Photo' },
  { key: 'lifestyle', label: 'Lifestyle / Drape Photo' },
  { key: 'other', label: 'Other Photos' },
];

const videoCategories = [
  { key: 'product', label: 'Full Product Video' },
  { key: 'detail', label: 'Detail Video' },
  { key: 'drape', label: 'Drape / Movement Video' },
  { key: 'maker', label: 'Maker Video' },
  { key: 'other', label: 'Additional Videos' },
];

const steps = [
  { num: 1, label: 'Basic Details' }, { num: 2, label: 'Product Story' },
  { num: 3, label: 'Maker Info' }, { num: 4, label: 'Personal Story' },
  { num: 5, label: 'Shop Info' }, { num: 6, label: 'Photos' },
  { num: 7, label: 'Videos' }, { num: 8, label: 'Review' },
];

export default function UploadProductPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [formData, setFormData] = useState({
    local_name: '', english_name: '', category: '', price: '', description: '',
    special_reason: '', materials: '', craft_technique: '', production_time: '',
    traditional_use: '', cultural_significance: '', additional_story: '',
    maker_name: '', maker_age: '', maker_location: '', maker_experience: '',
    maker_taught_by: '', maker_family_tradition: '', maker_generations: '1',
    maker_thoughts: '', maker_feelings: '', maker_memories: '', maker_personal_message: '',
    shop_name: '', shop_years: '', shop_location: '', stock_info: '', is_self_made: true,
  });

  const [images, setImages] = useState<Record<string, { file: File; preview: string }[]>>({});
  const [videos, setVideos] = useState<Record<string, File[]>>({});

  // Cleanup object URLs
  useEffect(() => {
    const urls = Object.values(images).flat().map(i => i.preview);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  const updateField = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
     const nextStep = () => setCurrentStep((s) => {
     const next = s + 1;
     return (next > 8 ? 8 : next) as Step;
   });
   const prevStep = () => setCurrentStep((s) => {
     const prev = s - 1;
     return (prev < 1 ? 1 : prev) as Step;
   });

  const handleImageChange = (category: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages(prev => ({ ...prev, [category]: [...(prev[category] || []), ...newFiles] }));
  };
  const removeImage = (category: string, index: number) => {
    setImages(prev => {
      const removed = prev[category]?.[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return { ...prev, [category]: prev[category].filter((_, i) => i !== index) };
    });
  };
  const handleVideoChange = (category: string, files: FileList | null) => {
    if (!files) return;
    setVideos(prev => ({ ...prev, [category]: [...(prev[category] || []), ...Array.from(files)] }));
  };
  const removeVideo = (category: string, index: number) => {
    setVideos(prev => ({ ...prev, [category]: prev[category].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { data: partner } = await supabase.from('partners').select('id').eq('profile_id', user.id).maybeSingle();
      if (!partner) throw new Error('Partner record not found.');

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          partner_id: partner.id, local_name: formData.local_name,
          english_name: formData.english_name, category: formData.category,
          price: formData.price, description: formData.description, status: 'submitted',
        })
        .select('id')
        .maybeSingle();
      if (productError) throw productError;

      await supabase.from('product_stories').insert({
        product_id: product.id, special_reason: formData.special_reason,
        materials: formData.materials, craft_technique: formData.craft_technique,
        production_time: formData.production_time, traditional_use: formData.traditional_use,
        cultural_significance: formData.cultural_significance, additional_story: formData.additional_story,
      });
      await supabase.from('maker_details').insert({
        product_id: product.id, full_name: formData.maker_name,
        age: formData.maker_age ? parseInt(formData.maker_age) : null,
        location: formData.maker_location, experience: formData.maker_experience,
        taught_by: formData.maker_taught_by, family_tradition: formData.maker_family_tradition,
        generations: parseInt(formData.maker_generations) || 1,
        thoughts: formData.maker_thoughts, feelings: formData.maker_feelings,
        memories: formData.maker_memories, personal_message: formData.maker_personal_message,
      });
      await supabase.from('shop_details').insert({
        partner_id: partner.id, shop_name: formData.shop_name,
        years_in_operation: formData.shop_years ? parseInt(formData.shop_years) : 0,
        shop_location: formData.shop_location, stock_information: formData.stock_info,
        is_self_made: formData.is_self_made,
      });

      // Upload images — store the storage PATH in DB, not the public URL
      setUploadProgress('Uploading photos...');
      for (const [category, items] of Object.entries(images)) {
        for (const { file } of items) {
          const ext = file.name.split('.').pop() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const storagePath = `${partner.id}/${product.id}/images/${category}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('product-images').upload(storagePath, file, { contentType: file.type });
          if (uploadError) { console.error('Image upload error:', uploadError); continue; }
          await supabase.from('media_assets').insert({
            partner_id: partner.id, product_id: product.id,
            media_type: 'image', media_category: category,
            file_name: file.name, storage_path: storagePath,
            file_size: file.size, mime_type: file.type,
          });
        }
      }

      // Upload videos — store the storage PATH in DB, not the public URL
      setUploadProgress('Uploading videos...');
      for (const [category, files] of Object.entries(videos)) {
        for (const file of files) {
          const ext = file.name.split('.').pop() || 'mp4';
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const storagePath = `${partner.id}/${product.id}/videos/${category}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('product-videos').upload(storagePath, file, { contentType: file.type });
          if (uploadError) { console.error('Video upload error:', uploadError); continue; }
          await supabase.from('media_assets').insert({
            partner_id: partner.id, product_id: product.id,
            media_type: 'video', media_category: category,
            file_name: file.name, storage_path: storagePath,
            file_size: file.size, mime_type: file.type,
          });
        }
      }

      router.push('/partner/products');
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <PartnerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Upload New Product</h1>
        <p className="text-stone-600 mb-8">Tell us about your beautiful product.</p>

        {uploadProgress && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
            {uploadProgress}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-1 flex-1 min-w-[36px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${currentStep >= step.num ? 'bg-pandaverse-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                {step.num}
              </div>
              <span className={`text-xs hidden sm:inline whitespace-nowrap ${currentStep >= step.num ? 'text-stone-900' : 'text-stone-400'}`}>{step.label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-stone-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Basic Product Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Product Name (Local Language) *</label>
                  <input value={formData.local_name} onChange={e => updateField('local_name', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Product Name (English) *</label>
                  <input value={formData.english_name} onChange={e => updateField('english_name', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
                  <select value={formData.category} onChange={e => updateField('category', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹) *</label>
                  <input value={formData.price} onChange={e => updateField('price', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="e.g. 2500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Description *</label>
                <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} rows={4} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="Describe your product in detail..." />
              </div>
            </div>
          )}

          {/* Step 2: Product Story */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Product Story</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">What makes this product special?</label>
                <textarea value={formData.special_reason} onChange={e => updateField('special_reason', e.target.value)} rows={3} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Materials Used</label>
                <textarea value={formData.materials} onChange={e => updateField('materials', e.target.value)} rows={3} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Craft / Weaving Technique</label>
                <textarea value={formData.craft_technique} onChange={e => updateField('craft_technique', e.target.value)} rows={3} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Production Time</label>
                  <input value={formData.production_time} onChange={e => updateField('production_time', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="e.g. 3 days" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Traditional Use</label>
                  <input value={formData.traditional_use} onChange={e => updateField('traditional_use', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Cultural Significance</label>
                <textarea value={formData.cultural_significance} onChange={e => updateField('cultural_significance', e.target.value)} rows={3} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Additional Story</label>
                <textarea value={formData.additional_story} onChange={e => updateField('additional_story', e.target.value)} rows={3} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
            </div>
          )}

          {/* Step 3: Maker Information */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Maker Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Maker Full Name *</label>
                  <input value={formData.maker_name} onChange={e => updateField('maker_name', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                  <input type="number" value={formData.maker_age} onChange={e => updateField('maker_age', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                  <input value={formData.maker_location} onChange={e => updateField('maker_location', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Experience</label>
                  <input value={formData.maker_experience} onChange={e => updateField('maker_experience', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="e.g. 25 years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Who taught the craft?</label>
                  <input value={formData.maker_taught_by} onChange={e => updateField('maker_taught_by', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Family Tradition</label>
                  <input value={formData.maker_family_tradition} onChange={e => updateField('maker_family_tradition', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Number of Generations</label>
                  <input type="number" min="1" value={formData.maker_generations} onChange={e => updateField('maker_generations', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Personal Story */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Personal Story</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">What were your thoughts while making this product?</label>
                <textarea value={formData.maker_thoughts} onChange={e => updateField('maker_thoughts', e.target.value)} rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">What were your feelings during the process?</label>
                <textarea value={formData.maker_feelings} onChange={e => updateField('maker_feelings', e.target.value)} rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Any special memories connected to this product?</label>
                <textarea value={formData.maker_memories} onChange={e => updateField('maker_memories', e.target.value)} rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Personal Message to the Buyer</label>
                <textarea value={formData.maker_personal_message} onChange={e => updateField('maker_personal_message', e.target.value)} rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
              </div>
            </div>
          )}

          {/* Step 5: Shop Information */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Shop Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Shop Name *</label>
                  <input value={formData.shop_name} onChange={e => updateField('shop_name', e.target.value)} required className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Years in Operation</label>
                  <input type="number" value={formData.shop_years} onChange={e => updateField('shop_years', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Shop Location</label>
                  <input value={formData.shop_location} onChange={e => updateField('shop_location', e.target.value)} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stock Information</label>
                  <textarea value={formData.stock_info} onChange={e => updateField('stock_info', e.target.value)} rows={2} className="w-full px-4 py-3 border border-stone-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.is_self_made} onChange={e => updateField('is_self_made', e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm text-stone-700">This product is self-made (not sourced from others)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Photos */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Product Photographs</h2>
              <p className="text-sm text-stone-600">Upload high-quality photos. You can add multiple images for each category.</p>
              {imageCategories.map(cat => (
                <div key={cat.key} className="border border-stone-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">{cat.label}</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(images[cat.key] || []).map(({ preview }, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-100">
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(cat.key, i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-pandaverse-400 text-stone-600 text-sm">
                    <Upload className="w-4 h-4" /> Add Photos
                    <input type="file" accept="image/*" multiple onChange={e => handleImageChange(cat.key, e.target.files)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Step 7: Videos */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Product Videos</h2>
              <p className="text-sm text-stone-600">Upload videos. Recommended: MP4, under 100MB each.</p>
              {videoCategories.map(cat => (
                <div key={cat.key} className="border border-stone-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">{cat.label}</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(videos[cat.key] || []).map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-stone-100 rounded-lg px-3 py-2 text-sm">
                        <Film className="w-4 h-4 text-stone-500" />
                        <span className="text-stone-700 max-w-[150px] truncate">{file.name}</span>
                        <button type="button" onClick={() => removeVideo(cat.key, i)} className="text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-pandaverse-400 text-stone-600 text-sm">
                    <Upload className="w-4 h-4" /> Add Video
                    <input type="file" accept="video/*" onChange={e => handleVideoChange(cat.key, e.target.files)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Step 8: Review */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review & Submit</h2>
              <div className="space-y-4">
                <ReviewSection title="Basic Details" fields={[
                  ['Product Name', formData.english_name],
                  ['Local Name', formData.local_name],
                  ['Category', formData.category],
                  ['Price', `₹${formData.price}`],
                  ['Description', formData.description],
                ]} />
                <ReviewSection title="Product Story" fields={[
                  ['Special Reason', formData.special_reason],
                  ['Materials', formData.materials],
                  ['Craft Technique', formData.craft_technique],
                  ['Production Time', formData.production_time],
                  ['Traditional Use', formData.traditional_use],
                ]} />
                <ReviewSection title="Maker" fields={[
                  ['Name', formData.maker_name],
                  ['Age', formData.maker_age],
                  ['Location', formData.maker_location],
                  ['Experience', formData.maker_experience],
                ]} />
                <ReviewSection title="Shop" fields={[
                  ['Name', formData.shop_name],
                  ['Years', formData.shop_years],
                ]} />
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">Uploaded Files</h3>
                  {Object.entries(images).map(([cat, files]) => (
                    <p key={cat} className="text-sm text-stone-600">{cat}: {files.length} images</p>
                  ))}
                  {Object.entries(videos).map(([cat, files]) => (
                    <p key={cat} className="text-sm text-stone-600">{cat}: {files.length} videos</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-200">
            <button type="button" onClick={prevStep} disabled={currentStep === 1 || submitting} className="flex items-center gap-2 px-6 py-2.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 disabled:opacity-50">
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            {currentStep < 8 ? (
              <button type="button" onClick={nextStep} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 disabled:opacity-50">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-semibold disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Product'}
              </button>
            )}
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

function ReviewSection({ title, fields }: { title: string; fields: [string, string][] }) {
  const hasData = fields.some(([, v]) => v && v.trim());
  if (!hasData) return null;
  return (
    <div>
      <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
      <div className="bg-stone-50 rounded-lg p-4 space-y-1">
        {fields.map(([label, value]) => value ? (
          <div key={label} className="text-sm"><span className="text-stone-500">{label}:</span> <span className="text-stone-800">{value}</span></div>
        ) : null)}
      </div>
    </div>
  );
}

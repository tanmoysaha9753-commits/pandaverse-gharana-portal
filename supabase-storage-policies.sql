-- ============================================
-- SUPABASE STORAGE POLICIES
-- ============================================
-- Run this AFTER creating the storage buckets
-- in the Supabase Storage UI.
--
-- IMPORTANT: Set each bucket to PRIVATE (not public).
-- Access is controlled exclusively by the RLS policies below.
-- ============================================

-- ============================================
-- STORAGE BUCKETS TO CREATE (in Supabase UI)
-- ============================================
-- Go to: Storage > New bucket
-- Create these two buckets:
-- 1. Name: product-images, Public: OFF (private)
-- 2. Name: product-videos, Public: OFF (private)
-- ============================================

-- ============================================
-- HELPER: Check if current user owns the partner record
-- ============================================

-- ============================================
-- STORAGE POLICIES FOR product-images BUCKET
-- ============================================

-- Partners can upload images to their own folder
CREATE POLICY "Partners can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can view images in their own folder
CREATE POLICY "Partners can view own images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can update images in their own folder
CREATE POLICY "Partners can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can delete images in their own folder
CREATE POLICY "Partners can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Admins can do everything with images
CREATE POLICY "Admins can manage images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'product-images' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STORAGE POLICIES FOR product-videos BUCKET
-- ============================================

-- Partners can upload videos to their own folder
CREATE POLICY "Partners can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-videos' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can view videos in their own folder
CREATE POLICY "Partners can view own videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can update videos in their own folder
CREATE POLICY "Partners can update own videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can delete videos in their own folder
CREATE POLICY "Partners can delete own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Admins can do everything with videos
CREATE POLICY "Admins can manage videos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'product-videos' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

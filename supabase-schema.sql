-- ============================================
-- PANDAVERSE GHARANA PORTAL - DATABASE SCHEMA
-- ============================================
-- Copy and paste this entire file into the
-- Supabase SQL Editor (in order) to set up your database.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: PROFILES
-- Stores user authentication data and role
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('admin', 'partner')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 2: PARTNERS
-- Stores Gharana Partner shop/business information
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  shop_type TEXT,
  village_town TEXT,
  district TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  years_in_business INTEGER DEFAULT 0,
  introduction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 3: PRODUCTS
-- Stores product information uploaded by partners
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  local_name TEXT NOT NULL,
  english_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 4: PRODUCT STORIES
-- Stores the story/cultural details for each product
-- ============================================
CREATE TABLE IF NOT EXISTS product_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  special_reason TEXT,
  materials TEXT,
  craft_technique TEXT,
  production_time TEXT,
  traditional_use TEXT,
  cultural_significance TEXT,
  additional_story TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 5: MAKER DETAILS
-- Stores information about the artisan/maker
-- ============================================
CREATE TABLE IF NOT EXISTS maker_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  experience TEXT,
  taught_by TEXT,
  family_tradition TEXT,
  generations INTEGER DEFAULT 1,
  thoughts TEXT,
  feelings TEXT,
  memories TEXT,
  personal_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 6: SHOP DETAILS
-- Stores additional shop information
-- ============================================
CREATE TABLE IF NOT EXISTS shop_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  years_in_operation INTEGER DEFAULT 0,
  shop_location TEXT,
  stock_information TEXT,
  is_self_made BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 7: MEDIA ASSETS
-- Stores metadata for all uploaded photos and videos
-- ============================================
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (for faster queries)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_partners_profile_id ON partners(profile_id);
CREATE INDEX IF NOT EXISTS idx_products_partner_id ON products(partner_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_stories_product_id ON product_stories(product_id);
CREATE INDEX IF NOT EXISTS idx_maker_details_product_id ON maker_details(product_id);
CREATE INDEX IF NOT EXISTS idx_shop_details_partner_id ON shop_details(partner_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_partner_id ON media_assets(partner_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_product_id ON media_assets(product_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(media_type);

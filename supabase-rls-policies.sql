-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
-- These policies ensure partners can only access
-- their own data, while admins can access everything.
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE maker_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILE POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile (needed during signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PARTNER POLICIES
-- ============================================
-- Partners can view their own partner record
CREATE POLICY "Partners can view own record" ON partners
  FOR SELECT USING (
    profile_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Partners can update their own partner record
CREATE POLICY "Partners can update own record" ON partners
  FOR UPDATE USING (profile_id = auth.uid());

-- Partners can insert their own partner record
CREATE POLICY "Partners can insert own record" ON partners
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Admins can do everything on partners
CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PRODUCT POLICIES
-- ============================================
-- Partners can view their own products
CREATE POLICY "Partners can view own products" ON products
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Partners can create their own products
CREATE POLICY "Partners can create products" ON products
  FOR INSERT WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can update their own products
CREATE POLICY "Partners can update own products" ON products
  FOR UPDATE USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Partners can delete their own products
CREATE POLICY "Partners can delete own products" ON products
  FOR DELETE USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Admins can do everything on products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PRODUCT STORY POLICIES
-- ============================================
CREATE POLICY "Partners can view own product stories" ON product_stories
  FOR SELECT USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners can insert own product stories" ON product_stories
  FOR INSERT WITH CHECK (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own product stories" ON product_stories
  FOR UPDATE USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own product stories" ON product_stories
  FOR DELETE USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage product stories" ON product_stories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- MAKER DETAIL POLICIES
-- ============================================
CREATE POLICY "Partners can view own maker details" ON maker_details
  FOR SELECT USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners can insert own maker details" ON maker_details
  FOR INSERT WITH CHECK (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own maker details" ON maker_details
  FOR UPDATE USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own maker details" ON maker_details
  FOR DELETE USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN partners pt ON p.partner_id = pt.id
      WHERE pt.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage maker details" ON maker_details
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SHOP DETAIL POLICIES
-- ============================================
CREATE POLICY "Partners can view own shop details" ON shop_details
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners can insert own shop details" ON shop_details
  FOR INSERT WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own shop details" ON shop_details
  FOR UPDATE USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own shop details" ON shop_details
  FOR DELETE USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage shop details" ON shop_details
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- MEDIA ASSET POLICIES
-- ============================================
CREATE POLICY "Partners can view own media" ON media_assets
  FOR SELECT USING (
    partner_id = (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners can insert own media" ON media_assets
  FOR INSERT WITH CHECK (
    partner_id = (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own media" ON media_assets
  FOR UPDATE USING (
    partner_id = (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own media" ON media_assets
  FOR DELETE USING (
    partner_id = (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage media assets" ON media_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

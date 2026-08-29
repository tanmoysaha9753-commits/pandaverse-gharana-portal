export type UserRole = 'admin' | 'partner';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Partner {
  id: string;
  profile_id: string;
  shop_name: string;
  shop_type: string;
  village_town: string;
  district: string;
  state: string;
  country: string;
  years_in_business: number;
  introduction: string;
  created_at: string;
  profile?: Profile;
}

export interface Product {
  id: string;
  partner_id: string;
  local_name: string;
  english_name: string;
  category: string;
  price: string;
  description: string;
  status: 'draft' | 'submitted';
  created_at: string;
  updated_at: string;
  partner?: Partner;
}

export interface ProductStory {
  id: string;
  product_id: string;
  special_reason: string;
  materials: string;
  craft_technique: string;
  production_time: string;
  traditional_use: string;
  cultural_significance: string;
  additional_story: string;
}

export interface MakerDetail {
  id: string;
  product_id: string;
  full_name: string;
  age: number;
  location: string;
  experience: string;
  taught_by: string;
  family_tradition: string;
  generations: number;
  thoughts: string;
  feelings: string;
  memories: string;
  personal_message: string;
}

export interface ShopDetail {
  id: string;
  partner_id: string;
  shop_name: string;
  years_in_operation: number;
  shop_location: string;
  stock_information: string;
  is_self_made: boolean;
}

export interface MediaAsset {
  id: string;
  partner_id: string;
  product_id: string | null;
  media_type: 'image' | 'video';
  media_category: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: Profile | null;
}

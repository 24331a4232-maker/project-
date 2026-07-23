import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ============ TYPES ============

export type UserRole = 'donor' | 'volunteer' | 'admin';

export type FoodType = 'Cooked' | 'Raw' | 'Bakery' | 'Beverages' | 'Other';

export type DonationStatus = 'available' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  organization: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  food_name: string;
  food_type: FoodType;
  quantity: string;
  pickup_address: string;
  pickup_time: string;
  expiry_time: string;
  contact_number: string;
  image_url: string | null;
  status: DonationStatus;
  volunteer_id: string | null;
  volunteer_name: string | null;
  proof_image_url: string | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

// ============ CONSTANTS ============

export const FOOD_TYPES: FoodType[] = ['Cooked', 'Raw', 'Bakery', 'Beverages', 'Other'];

export const FOOD_TYPE_META: Record<FoodType, { emoji: string; color: string }> = {
  Cooked: { emoji: '🍱', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  Raw: { emoji: '🥬', color: 'bg-green-100 text-green-700 border-green-200' },
  Bakery: { emoji: '🍞', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  Beverages: { emoji: '🥤', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  Other: { emoji: '📦', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export const STATUS_META: Record<DonationStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'Available', color: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  picked_up: { label: 'Picked Up', color: 'bg-accent-100 text-accent-700', dot: 'bg-accent-500' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

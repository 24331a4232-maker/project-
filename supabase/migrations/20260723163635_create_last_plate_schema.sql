/*
# Create The Last Plate Project schema (multi-user with auth)

A surplus food donation platform connecting donors (hotels, restaurants, event
organizers) with volunteers who collect and deliver food to people in need.

## 1. New Tables

### profiles
- id (uuid, PK, references auth.users) — one row per user
- full_name (text) — display name
- phone (text) — contact number
- role (text) — 'donor' | 'volunteer' | 'admin'
- organization (text) — optional org name for donors
- address (text) — optional base address
- avatar_url (text) — optional profile photo
- created_at (timestamptz)

### donations
- id (uuid, PK)
- donor_id (uuid, FK → profiles.id) — who donated the food
- donor_name (text) — denormalized for quick display
- food_name (text) — name of the food
- food_type (text) — Cooked / Raw / Bakery / Beverages / Other
- quantity (text) — e.g. "50 meals", "10 kg"
- pickup_address (text) — where to collect
- pickup_time (timestamptz) — when it can be collected
- expiry_time (timestamptz) — when it's no longer good
- contact_number (text) — donor contact
- image_url (text) — food photo (Supabase Storage)
- status (text) — 'available' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
- volunteer_id (uuid, FK → profiles.id, nullable) — who claimed it
- volunteer_name (text, nullable) — denormalized
- proof_image_url (text, nullable) — delivery proof photo
- accepted_at (timestamptz, nullable)
- picked_up_at (timestamptz, nullable)
- delivered_at (timestamptz, nullable)
- created_at (timestamptz)

## 2. Security (RLS)
- profiles: each authenticated user can read all profiles (needed to show
  donor/volunteer names), but can only update/insert their own row.
- donations: all authenticated users can read (donors see their own, volunteers
  see available + their claimed, admin sees all). Only the donor can update/
  delete their own donations. Volunteers can update status fields on donations
  they have claimed (accepted/picked_up/delivered + proof image).

## 3. Indexes
- donations(status) for filtering available donations
- donations(donor_id) for donor dashboard queries
- donations(volunteer_id) for volunteer dashboard queries
- donations(created_at DESC) for chronological listing
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'donor' CHECK (role IN ('donor', 'volunteer', 'admin')),
  organization text,
  address text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read profiles (needed to display names)
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO authenticated USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ DONATIONS ============
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  donor_name text NOT NULL,
  food_name text NOT NULL,
  food_type text NOT NULL DEFAULT 'Cooked',
  quantity text NOT NULL,
  pickup_address text NOT NULL,
  pickup_time timestamptz NOT NULL,
  expiry_time timestamptz NOT NULL,
  contact_number text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'accepted', 'picked_up', 'delivered', 'cancelled')),
  volunteer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  volunteer_name text,
  proof_image_url text,
  accepted_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read donations
DROP POLICY IF EXISTS "donations_select_all" ON donations;
CREATE POLICY "donations_select_all" ON donations FOR SELECT
  TO authenticated USING (true);

-- Any authenticated user can insert a donation (donor_id defaults to their uid)
DROP POLICY IF EXISTS "donations_insert_own" ON donations;
CREATE POLICY "donations_insert_own" ON donations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = donor_id);

-- Donors can update/delete their own donations;
-- Volunteers can update donations they have claimed (for status changes + proof);
-- Admins can update/delete any donation.
DROP POLICY IF EXISTS "donations_update" ON donations;
CREATE POLICY "donations_update" ON donations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = donor_id
    OR auth.uid() = volunteer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    auth.uid() = donor_id
    OR auth.uid() = volunteer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "donations_delete" ON donations;
CREATE POLICY "donations_delete" ON donations FOR DELETE
  TO authenticated
  USING (
    auth.uid() = donor_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_volunteer_id ON donations(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- ============ STORAGE BUCKET for food images ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload, everyone can read
DROP POLICY IF EXISTS "food_images_read" ON storage.objects;
CREATE POLICY "food_images_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'food-images');

DROP POLICY IF EXISTS "food_images_upload" ON storage.objects;
CREATE POLICY "food_images_upload" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'food-images');

DROP POLICY IF EXISTS "food_images_update" ON storage.objects;
CREATE POLICY "food_images_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'food-images');

-- ============ TRIGGER: auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, organization, address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'address'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

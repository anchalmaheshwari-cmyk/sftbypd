/*
  # Create listings table for property management

  ## Overview
  This migration creates the core listings table for managing property listings on the Sqft by PD website.

  ## New Tables
  
  ### `listings`
  - `id` (uuid, primary key) - Unique identifier for each listing
  - `title` (text) - Property title/name
  - `price` (text) - Display price (e.g., "₹12.5 Cr")
  - `location` (text) - Property location in Chennai
  - `size` (text) - Square footage
  - `bhk` (text) - Number of bedrooms (e.g., "3", "4", "Commercial")
  - `highlights` (jsonb) - Array of key property highlights
  - `amenities` (jsonb) - Array of amenities
  - `images` (jsonb) - Array of image URLs
  - `status` (text) - "Available" or "Closed"
  - `sort_order` (integer) - For controlling display order
  - `created_at` (timestamptz) - Auto-populated creation timestamp
  - `updated_at` (timestamptz) - Auto-populated update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the listings table
  - Public read access for all users (no auth required for viewing)
  - Insert/update/delete operations require authentication
  
  ### Policies
  1. **Public read access** - Anyone can view listings (for website visitors)
  2. **Authenticated admin access** - Authenticated users can manage listings

  ## Notes
  - Images are stored as URLs (using external hosting)
  - Status field controls whether listing appears in "Active" or "Closed" section
  - sort_order allows manual control of listing display order
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price text NOT NULL,
  location text NOT NULL,
  size text NOT NULL,
  bhk text NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'Available',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings"
  ON listings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_sort_order ON listings(sort_order);
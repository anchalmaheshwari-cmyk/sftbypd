/*
  # Create Storage Bucket for Property Images

  1. Storage Setup
    - Creates a public storage bucket named 'property-images'
    - Allows image uploads up to 10MB
    - Supports JPEG, PNG, and WebP formats
  
  2. Security Policies
    - Public read access for all images (so visitors can view listings)
    - Public write access for uploads (admin panel)
    - Public delete access for admin management
  
  3. Notes
    - Images are publicly accessible once uploaded
    - This enables direct image hosting without external services
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Enable public access for viewing images (SELECT)
CREATE POLICY "Public read access for property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Enable public upload access (INSERT)
CREATE POLICY "Public upload access for property images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'property-images');

-- Enable public delete access (DELETE) for admin functionality
CREATE POLICY "Public delete access for property images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'property-images');

-- Enable public update access (UPDATE) for admin functionality
CREATE POLICY "Public update access for property images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'property-images')
WITH CHECK (bucket_id = 'property-images');
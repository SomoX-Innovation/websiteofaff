-- =============================================================================
-- Create storage bucket for cover images
-- =============================================================================

-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-images',
  'cover-images',
  true,
  10485760, -- 10 MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Row Level Security Policies for storage.objects
-- =============================================================================

-- Allow public read access to all files in cover-images bucket
DROP POLICY IF EXISTS "Public read cover-images" ON storage.objects;
CREATE POLICY "Public read cover-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-images');

-- Allow authenticated admins to upload images to cover-images bucket
DROP POLICY IF EXISTS "Admin upload cover images" ON storage.objects;
CREATE POLICY "Admin upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cover-images'
    AND auth.uid() IN (SELECT user_id FROM public.site_admins)
  );

-- Allow admins to delete files from cover-images bucket
DROP POLICY IF EXISTS "Admin delete cover images" ON storage.objects;
CREATE POLICY "Admin delete cover images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cover-images'
    AND auth.uid() IN (SELECT user_id FROM public.site_admins)
  );

-- Allow admins to update file metadata
DROP POLICY IF EXISTS "Admin update cover images" ON storage.objects;
CREATE POLICY "Admin update cover images"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'cover-images'
    AND auth.uid() IN (SELECT user_id FROM public.site_admins)
  );



/*
  # Storage RLS for Notices Bucket

  1. Changes
    - Create notices storage bucket if not exists
    - Set up RLS policies for notices bucket:
      - Public read access for all files
      - Write access only for authenticated superadmins
      - Delete access only for authenticated superadmins

  2. Security
    - Enable RLS on notices bucket
    - Add policies for secure file management
*/

-- Create notices bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('notices', 'notices', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view notice images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload notice images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete notice images" ON storage.objects;

-- Create policies for notices bucket
-- Allow public read access
CREATE POLICY "Public can view notice images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'notices');

-- Allow authenticated superadmins to upload
CREATE POLICY "Authenticated users can upload notice images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'notices'
    AND (
      SELECT role = 'superadmin'
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Allow authenticated superadmins to delete
CREATE POLICY "Authenticated users can delete notice images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'notices'
    AND (
      SELECT role = 'superadmin'
      FROM auth.users
      WHERE id = auth.uid()
    )
  );
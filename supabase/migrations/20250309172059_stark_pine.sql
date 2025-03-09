/*
  # Create notices table for landing page

  1. New Tables
    - `notices`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `image_url` (text, nullable)
      - `active` (boolean)
      - `order` (integer)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)

  2. Security
    - Enable RLS on `notices` table
    - Add policies for:
      - Public read access for active notices
      - Superadmin full access
*/

CREATE TABLE notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  image_url text,
  active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (only active notices)
CREATE POLICY "Public can view active notices" 
  ON notices
  FOR SELECT
  TO public
  USING (active = true);

-- Policy for superadmin full access
CREATE POLICY "Superadmin has full access" 
  ON notices
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  );
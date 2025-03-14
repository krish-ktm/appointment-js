/*
  # Add doctor messages table

  1. New Tables
    - `doctor_messages`
      - `id` (uuid, primary key)
      - `message` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)

  2. Security
    - Enable RLS on `doctor_messages` table
    - Add policies for:
      - Public read access for active messages
      - Superadmin full access
*/

CREATE TABLE doctor_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

ALTER TABLE doctor_messages ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (only active messages)
CREATE POLICY "Public can view active messages" 
  ON doctor_messages
  FOR SELECT
  TO public
  USING (active = true);

-- Policy for superadmin full access
CREATE POLICY "Superadmin has full access" 
  ON doctor_messages
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
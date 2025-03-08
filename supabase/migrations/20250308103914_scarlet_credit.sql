/*
  # Update appointments table structure and policies
  
  1. Changes
    - Remove user_id column and its foreign key constraint
    - Update policies to allow public access
  
  2. Security
    - Remove existing user-specific policies
    - Add new public access policies
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

-- Now we can safely drop the column
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_user_id_fkey,
  DROP COLUMN IF EXISTS user_id;

-- Create new public policies
CREATE POLICY "Public can read appointments"
  ON appointments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create appointments"
  ON appointments
  FOR INSERT
  TO public
  WITH CHECK (true);
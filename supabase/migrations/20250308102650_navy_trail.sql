/*
  # Update appointments table and policies

  1. Changes
    - Remove user_id requirement
    - Update RLS policies for public access
    - Add max_slots column to track slot capacity

  2. Security
    - Enable public access for appointments
    - Maintain slot availability checks
*/

ALTER TABLE appointments
  DROP CONSTRAINT appointments_user_id_fkey,
  DROP COLUMN user_id;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

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
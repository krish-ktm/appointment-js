/*
  # Create MR appointments table

  1. New Tables
    - `mr_appointments`
      - `id` (uuid, primary key)
      - `mr_name` (text)
      - `company_name` (text)
      - `division_name` (text)
      - `contact_no` (text)
      - `appointment_date` (date)
      - `created_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on `mr_appointments` table
    - Add policies for:
      - Public read access
      - Public insert access with validation
*/

CREATE TABLE mr_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mr_name text NOT NULL,
  company_name text NOT NULL,
  division_name text NOT NULL,
  contact_no text NOT NULL,
  appointment_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

ALTER TABLE mr_appointments ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view mr appointments" 
  ON mr_appointments
  FOR SELECT
  TO public
  USING (true);

-- Policy for public insert access
CREATE POLICY "Public can create mr appointments" 
  ON mr_appointments
  FOR INSERT
  TO public
  WITH CHECK (true);
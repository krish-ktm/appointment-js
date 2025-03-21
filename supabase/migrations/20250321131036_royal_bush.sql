/*
  # Clinic Closure Dates Management

  1. New Tables
    - `clinic_closure_dates`
      - `id` (uuid, primary key)
      - `date` (date)
      - `reason` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

CREATE TABLE clinic_closure_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clinic_closure_dates ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view closure dates"
  ON clinic_closure_dates
  FOR SELECT
  TO public
  USING (true);

-- Admin write access
CREATE POLICY "Only superadmin can modify closure dates"
  ON clinic_closure_dates
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
      AND users.status = 'active'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_clinic_closure_dates_updated_at
  BEFORE UPDATE ON clinic_closure_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
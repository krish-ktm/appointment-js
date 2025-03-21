/*
  # MR Appointment Management Tables

  1. New Tables
    - `mr_weekdays`
      - `id` (uuid, primary key)
      - `day` (text, day of week)
      - `is_working` (boolean)
      - `max_appointments` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `mr_closure_dates`
      - `id` (uuid, primary key)
      - `date` (date)
      - `reason` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

-- MR Weekdays Table
CREATE TABLE mr_weekdays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL CHECK (day IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  is_working boolean DEFAULT true,
  max_appointments integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- MR Closure Dates Table
CREATE TABLE mr_closure_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mr_weekdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE mr_closure_dates ENABLE ROW LEVEL SECURITY;

-- Policies for mr_weekdays
CREATE POLICY "Public can view mr weekdays"
  ON mr_weekdays
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only superadmin can modify mr weekdays"
  ON mr_weekdays
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
      AND users.status = 'active'
    )
  );

-- Policies for mr_closure_dates
CREATE POLICY "Public can view mr closure dates"
  ON mr_closure_dates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only superadmin can modify mr closure dates"
  ON mr_closure_dates
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
      AND users.status = 'active'
    )
  );

-- Add updated_at trigger to mr_weekdays
CREATE TRIGGER update_mr_weekdays_updated_at
  BEFORE UPDATE ON mr_weekdays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger to mr_closure_dates
CREATE TRIGGER update_mr_closure_dates_updated_at
  BEFORE UPDATE ON mr_closure_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default weekdays
INSERT INTO mr_weekdays (day, is_working, max_appointments)
VALUES
  ('Sunday', false, 5),
  ('Monday', true, 5),
  ('Tuesday', true, 5),
  ('Wednesday', true, 5),
  ('Thursday', true, 5),
  ('Friday', true, 5),
  ('Saturday', true, 5);
/*
  # Time Management Schema

  1. New Tables
    - `working_hours`
      - `id` (uuid, primary key)
      - `day` (text, day of week)
      - `is_working` (boolean)
      - `morning_start` (time, nullable)
      - `morning_end` (time, nullable)
      - `evening_start` (time, nullable)
      - `evening_end` (time, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `time_slots`
      - `id` (uuid, primary key)
      - `time` (time)
      - `max_bookings` (integer)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

-- Working Hours Table
CREATE TABLE working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL CHECK (day IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  is_working boolean DEFAULT true,
  morning_start time,
  morning_end time,
  evening_start time,
  evening_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Time Slots Table
CREATE TABLE time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time time NOT NULL,
  max_bookings integer DEFAULT 3,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Policies for working_hours
CREATE POLICY "Public can view working hours"
  ON working_hours
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only superadmin can modify working hours"
  ON working_hours
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
      AND users.status = 'active'
    )
  );

-- Policies for time_slots
CREATE POLICY "Public can view time slots"
  ON time_slots
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only superadmin can modify time slots"
  ON time_slots
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
      AND users.status = 'active'
    )
  );

-- Insert default working hours
INSERT INTO working_hours (day, is_working, morning_start, morning_end, evening_start, evening_end)
VALUES
  ('Sunday', false, NULL, NULL, NULL, NULL),
  ('Monday', true, '09:30', '12:00', '16:00', '18:30'),
  ('Tuesday', true, '09:30', '12:00', '16:00', '18:30'),
  ('Wednesday', true, '09:30', '12:00', '16:00', '18:30'),
  ('Thursday', true, '09:30', '12:00', '16:00', '18:30'),
  ('Friday', true, '09:30', '12:00', '16:00', '18:30'),
  ('Saturday', true, '09:30', '16:00', NULL, NULL);

-- Insert default time slots
INSERT INTO time_slots (time, max_bookings, is_available)
VALUES
  -- Morning slots
  ('09:30', 3, true),
  ('09:45', 3, true),
  ('10:00', 3, true),
  ('10:15', 3, true),
  ('10:30', 3, true),
  ('10:45', 3, true),
  ('11:00', 3, true),
  ('11:15', 3, true),
  ('11:30', 3, true),
  ('11:45', 3, true),
  ('12:00', 3, true),
  -- Evening slots
  ('16:00', 3, true),
  ('16:15', 3, true),
  ('16:30', 3, true),
  ('16:45', 3, true),
  ('17:00', 3, true),
  ('17:15', 3, true),
  ('17:30', 3, true),
  ('17:45', 3, true),
  ('18:00', 3, true),
  ('18:15', 3, true),
  ('18:30', 3, true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_working_hours_updated_at
  BEFORE UPDATE ON working_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
  BEFORE UPDATE ON time_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
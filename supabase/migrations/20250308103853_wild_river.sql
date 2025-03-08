/*
  # Update appointments table policies and functions

  1. Changes
    - Add RLS policies for appointments table if not exists
    - Create function for checking appointment slot availability
  
  2. Security
    - Enable RLS on appointments table
    - Add policies for:
      - Users reading their own appointments
      - Users creating appointments
      - Users updating their own appointments
*/

-- Enable RLS (idempotent)
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

-- Create policies
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop function if exists and create new version
DROP FUNCTION IF EXISTS check_appointment_slot_available;

CREATE OR REPLACE FUNCTION check_appointment_slot_available(
  check_date date,
  check_time text,
  max_slots integer DEFAULT 4
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) < max_slots
    FROM appointments
    WHERE appointment_date = check_date
    AND appointment_time = check_time
    AND status != 'cancelled'
  );
END;
$$;
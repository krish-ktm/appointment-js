/*
  # Create appointments system tables

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `age` (integer)
      - `city` (text)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `created_at` (timestamptz)
      - `status` (text)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for:
      - Users can read their own appointments
      - Users can create appointments
      - Users can update their own appointments
*/

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  phone text NOT NULL,
  age integer NOT NULL,
  city text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending',
  CONSTRAINT valid_age CHECK (age >= 0 AND age <= 120)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

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

-- Create function to check appointment slot availability
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
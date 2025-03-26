/*
  # Add time slots support to MR weekdays

  1. Changes
    - Add slot_interval column to mr_weekdays
    - Add slots jsonb column to store time slots
    - Update existing data with default slots

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to mr_weekdays table
ALTER TABLE mr_weekdays 
ADD COLUMN slot_interval integer DEFAULT 30 CHECK (slot_interval IN (15, 30)),
ADD COLUMN slots jsonb DEFAULT '[]'::jsonb;

-- Update existing data with default slots
UPDATE mr_weekdays
SET slot_interval = 30,
    slots = CASE
      WHEN is_working AND day != 'Sunday' THEN
        json_build_array(
          json_build_object('time', '09:30 AM', 'maxBookings', max_appointments),
          json_build_object('time', '10:00 AM', 'maxBookings', max_appointments),
          json_build_object('time', '10:30 AM', 'maxBookings', max_appointments),
          json_build_object('time', '11:00 AM', 'maxBookings', max_appointments),
          json_build_object('time', '11:30 AM', 'maxBookings', max_appointments),
          json_build_object('time', '12:00 PM', 'maxBookings', max_appointments),
          json_build_object('time', '02:00 PM', 'maxBookings', max_appointments),
          json_build_object('time', '02:30 PM', 'maxBookings', max_appointments),
          json_build_object('time', '03:00 PM', 'maxBookings', max_appointments),
          json_build_object('time', '03:30 PM', 'maxBookings', max_appointments),
          json_build_object('time', '04:00 PM', 'maxBookings', max_appointments)
        )::jsonb
      ELSE
        '[]'::jsonb
    END;
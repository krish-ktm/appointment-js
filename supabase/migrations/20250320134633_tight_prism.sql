/*
  # Update Time Management Schema

  1. Changes
    - Add new columns to working_hours table:
      - `slot_interval` (integer) - 15 or 30 minutes
      - `slots` (jsonb) - Array of time slots with max bookings
    - Drop time_slots table as it's no longer needed

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to working_hours table
ALTER TABLE working_hours 
ADD COLUMN slot_interval integer DEFAULT 30 CHECK (slot_interval IN (15, 30)),
ADD COLUMN slots jsonb DEFAULT '[]'::jsonb;

-- Drop time_slots table as it's no longer needed
DROP TABLE time_slots;

-- Update working_hours data to include default slots
UPDATE working_hours
SET slot_interval = 30,
    slots = CASE
      WHEN is_working AND day != 'Sunday' AND day != 'Saturday' THEN
        json_build_array(
          -- Morning slots
          json_build_object('time', '09:30', 'maxBookings', 3),
          json_build_object('time', '10:00', 'maxBookings', 3),
          json_build_object('time', '10:30', 'maxBookings', 3),
          json_build_object('time', '11:00', 'maxBookings', 3),
          json_build_object('time', '11:30', 'maxBookings', 3),
          json_build_object('time', '12:00', 'maxBookings', 3),
          -- Evening slots
          json_build_object('time', '16:00', 'maxBookings', 3),
          json_build_object('time', '16:30', 'maxBookings', 3),
          json_build_object('time', '17:00', 'maxBookings', 3),
          json_build_object('time', '17:30', 'maxBookings', 3),
          json_build_object('time', '18:00', 'maxBookings', 3),
          json_build_object('time', '18:30', 'maxBookings', 3)
        )::jsonb
      WHEN is_working AND day = 'Saturday' THEN
        json_build_array(
          -- Morning slots only
          json_build_object('time', '09:30', 'maxBookings', 3),
          json_build_object('time', '10:00', 'maxBookings', 3),
          json_build_object('time', '10:30', 'maxBookings', 3),
          json_build_object('time', '11:00', 'maxBookings', 3),
          json_build_object('time', '11:30', 'maxBookings', 3),
          json_build_object('time', '12:00', 'maxBookings', 3),
          json_build_object('time', '12:30', 'maxBookings', 3),
          json_build_object('time', '13:00', 'maxBookings', 3),
          json_build_object('time', '13:30', 'maxBookings', 3),
          json_build_object('time', '14:00', 'maxBookings', 3),
          json_build_object('time', '14:30', 'maxBookings', 3),
          json_build_object('time', '15:00', 'maxBookings', 3),
          json_build_object('time', '15:30', 'maxBookings', 3),
          json_build_object('time', '16:00', 'maxBookings', 3)
        )::jsonb
      ELSE
        '[]'::jsonb
    END;
/*
  # Remove unused columns from mr_weekdays

  Since we're using JSON array for time slots, we don't need:
  - max_appointments (now managed per slot)
  - slot_interval (no longer needed for generating slots)
*/

-- Remove the now-unused columns
ALTER TABLE mr_weekdays DROP COLUMN max_appointments;
ALTER TABLE mr_weekdays DROP COLUMN slot_interval; 
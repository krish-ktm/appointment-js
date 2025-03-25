/*
  # Add language support to doctor messages

  1. Alter existing `doctor_messages` table:
    - Rename `message` to `message_en` for English
    - Add `message_gu` for Gujarati
    - Keep existing data in `message_en`
*/

-- Rename the existing message column to message_en
ALTER TABLE doctor_messages RENAME COLUMN message TO message_en;

-- Add new column for Gujarati messages
ALTER TABLE doctor_messages ADD COLUMN message_gu text; 
/*
  # Fix notices table schema

  1. Changes
    - Add images array column
    - Remove image_url column
    - Add support for multilingual content

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add images array if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notices' AND column_name = 'images') THEN
    ALTER TABLE notices ADD COLUMN images text[] DEFAULT '{}';
  END IF;

  -- Add formatted_content if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notices' AND column_name = 'formatted_content') THEN
    ALTER TABLE notices ADD COLUMN formatted_content jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Convert title and content to jsonb if they're text
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'notices' 
    AND column_name = 'title' 
    AND data_type = 'text'
  ) THEN
    -- Create temporary columns
    ALTER TABLE notices ADD COLUMN title_new jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE notices ADD COLUMN content_new jsonb DEFAULT '{}'::jsonb;
    
    -- Update new columns with existing data
    UPDATE notices 
    SET 
      title_new = jsonb_build_object('en', title, 'gu', title),
      content_new = jsonb_build_object('en', content, 'gu', content);
    
    -- Drop old columns
    ALTER TABLE notices DROP COLUMN title;
    ALTER TABLE notices DROP COLUMN content;
    
    -- Rename new columns
    ALTER TABLE notices RENAME COLUMN title_new TO title;
    ALTER TABLE notices RENAME COLUMN content_new TO content;
  END IF;

  -- Drop image_url if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notices' AND column_name = 'image_url') THEN
    ALTER TABLE notices DROP COLUMN image_url;
  END IF;
END $$;
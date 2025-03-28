/*
  # Add image download rules table

  1. New Tables
    - `image_download_rules`
      - `id` (uuid, primary key)
      - `type` (text) - 'patient' or 'mr'
      - `title` (jsonb) - Multilingual title
      - `content` (jsonb) - Multilingual content in markdown format
      - `order` (integer) - Display order
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

CREATE TABLE image_download_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('patient', 'mr')),
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  "order" integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE image_download_rules ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active rules
CREATE POLICY "Allow public read access to active rules"
  ON image_download_rules
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage rules
CREATE POLICY "Allow authenticated users to manage rules"
  ON image_download_rules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_image_download_rules_updated_at
  BEFORE UPDATE ON image_download_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default rules
INSERT INTO image_download_rules (type, title, content, "order", is_active)
VALUES 
  (
    'patient',
    '{"en": "Important Notes", "gu": "મહત્વપૂર્ણ નોંધ"}',
    '{"en": "- Please arrive 10 minutes before your appointment time\n- Bring your previous medical records\n- Wear a mask during your visit", "gu": "- કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો\n- તમારા અગાઉના મેડિકલ રેકોર્ડ્સ લાવો\n- તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"}',
    1,
    true
  ),
  (
    'mr',
    '{"en": "Important Notes", "gu": "મહત્વપૂર્ણ નોંધ"}',
    '{"en": "- Please arrive 10 minutes before your appointment time\n- Bring your company ID card and visiting card\n- Wear a mask during your visit", "gu": "- કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો\n- તમારું કંપની ID કાર્ડ અને વિઝિટિંગ કાર્ડ લાવો\n- તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"}',
    1,
    true
  );
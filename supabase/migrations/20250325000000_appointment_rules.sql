/*
  # Add appointment rules table

  1. Changes
    - Create appointment_rules table
    - Add multilingual support for rules
    - Add RLS policies for security

  2. Features
    - Support for multiple languages (en, gu)
    - Rules can be enabled/disabled
    - Rules can be ordered for display
*/

-- Create appointment_rules table
CREATE TABLE IF NOT EXISTS appointment_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title jsonb NOT NULL DEFAULT '{}'::jsonb,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE appointment_rules ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active rules
CREATE POLICY "Allow public read access to active rules"
    ON appointment_rules
    FOR SELECT
    TO public
    USING (is_active = true);

-- Allow authenticated users to manage rules
CREATE POLICY "Allow authenticated users to manage rules"
    ON appointment_rules
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert some default rules
INSERT INTO appointment_rules (title, content, is_active, display_order)
VALUES 
    (
        '{"en": "Cancellation Policy", "gu": "રદીકરણ નીતિ"}',
        '{"en": "Please cancel your appointment at least 24 hours in advance.", "gu": "કૃપા કરી તમારી એપોઇન્ટમેન્ટ ઓછામાં ઓછા 24 કલાક અગાઉ રદ કરો."}',
        true,
        1
    ),
    (
        '{"en": "Required Documents", "gu": "જરૂરી દસ્તાવેજો"}',
        '{"en": "Please bring your ID proof and any relevant medical records.", "gu": "કૃપા કરી તમારો ID પ્રૂફ અને કોઈપણ સંબંધિત તબીબી રેકોર્ડ લાવો."}',
        true,
        2
    ); 
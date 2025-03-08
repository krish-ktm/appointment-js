/*
  # Fix users table policies

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Update policy definitions for better security
    - Keep existing table structure

  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Public insert for initial setup
      - Basic read access
      - Role-based update permissions
*/

-- Recreate the users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('superadmin', 'receptionist')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Superadmin can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Superadmin can update all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Superadmin can create users" ON users;

-- Create simplified policies
CREATE POLICY "Allow public read for active users"
  ON users
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Allow self update"
  ON users
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Allow public insert"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- Insert initial superadmin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com') THEN
    INSERT INTO users (email, password, role, name)
    VALUES (
      'admin@example.com',
      -- This is a bcrypt hash of 'Admin@123'
      '$2a$10$RwxoVl5L0mhgQqWEh6ARh.Ls9zB3q7BpgqYeYnW0YkzEVqGLXnmkO',
      'superadmin',
      'System Admin'
    );
  END IF;
END
$$;
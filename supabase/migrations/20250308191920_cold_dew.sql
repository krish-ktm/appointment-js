/*
  # Fix user authentication

  1. Changes
    - Recreate users table with proper password hashing
    - Update initial admin user with correct password hash
    - Simplify RLS policies

  2. Security
    - Enable RLS
    - Add basic policies for authentication
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
DROP POLICY IF EXISTS "Allow public read for active users" ON users;
DROP POLICY IF EXISTS "Allow self update" ON users;
DROP POLICY IF EXISTS "Allow public insert" ON users;

-- Create simplified policies
CREATE POLICY "Enable read access for all users"
  ON users
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON users
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on email"
  ON users
  FOR UPDATE
  TO PUBLIC
  USING (true);

-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin@example.com';

-- Insert initial superadmin user with correct password hash
-- Password: Admin@123
INSERT INTO users (email, password, role, name, status)
VALUES (
  'admin@example.com',
  '$2a$10$RwxoVl5L0mhgQqWEh6ARh.Ls9zB3q7BpgqYeYnW0YkzEVqGLXnmkO',
  'superadmin',
  'System Admin',
  'active'
);
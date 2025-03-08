/*
  # Admin Panel Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text, hashed)
      - `role` (text, either 'superadmin' or 'receptionist')
      - `name` (text)
      - `created_at` (timestamp)
      - `last_login` (timestamp)
      - `status` (text, either 'active' or 'inactive')

  2. Security
    - Enable RLS on users table
    - Add policies for role-based access
*/

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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Superadmin can read all users
CREATE POLICY "Superadmin can read all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'superadmin'
      AND u.status = 'active'
    )
  );

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (id = auth.uid());

-- Superadmin can update all users
CREATE POLICY "Superadmin can update all users"
  ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'superadmin'
      AND u.status = 'active'
    )
  );

-- Users can update their own non-critical data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND NEW.role = OLD.role -- Cannot change own role
    AND NEW.status = OLD.status -- Cannot change own status
  );

-- Only superadmin can create new users
CREATE POLICY "Superadmin can create users"
  ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'superadmin'
      AND u.status = 'active'
    )
  );

-- Insert initial superadmin user (password: Admin@123)
INSERT INTO users (email, password, role, name)
VALUES (
  'admin@example.com',
  -- This is a bcrypt hash of 'Admin@123'
  '$2a$10$RwxoVl5L0mhgQqWEh6ARh.Ls9zB3q7BpgqYeYnW0YkzEVqGLXnmkO',
  'superadmin',
  'System Admin'
);
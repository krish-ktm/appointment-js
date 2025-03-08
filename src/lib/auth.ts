import { supabase } from './supabase';
import { User, LoginCredentials } from '../types';
import bcrypt from 'bcryptjs';

export async function login({ email, password }: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single();

    if (error) throw new Error('Invalid credentials');
    if (!users) throw new Error('User not found');

    const isValidPassword = await bcrypt.compare(password, users.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', users.id);

    const user: User = {
      id: users.id,
      email: users.email,
      role: users.role,
      name: users.name,
      created_at: users.created_at,
      last_login: users.last_login,
      status: users.status
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function createUser(userData: Partial<User> & { password: string }): Promise<{ user: User | null; error: string | null }> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        password: hashedPassword
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      created_at: newUser.created_at,
      last_login: newUser.last_login,
      status: newUser.status
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUsers(): Promise<{ users: User[]; error: string | null }> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { users: users as User[], error: null };
  } catch (error) {
    return { users: [], error: error.message };
  }
}
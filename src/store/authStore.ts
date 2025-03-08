import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, AdminUser } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .single();

    if (!adminUser) throw new Error('Not authorized as admin');

    set({ user: adminUser as AdminUser });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
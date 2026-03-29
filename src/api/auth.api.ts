import { supabase } from '../lib/supabase';

export const authApi = {
  /**
   * Sign up new user
   */
  async signUp(email: string, password: string) {
    try {
      console.log('[AuthAPI] Signing up:', email);
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: undefined,
        },
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('[AuthAPI] SignUp error:', error.message);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string) {
    try {
      console.log('[AuthAPI] Logging in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user, session: data.session };
    } catch (error: any) {
      console.error('[AuthAPI] Login error:', error.message);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error: any) {
      console.error('[AuthAPI] GetSession error:', error);
      return null;
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error: any) {
      console.error('[AuthAPI] GetUser error:', error);
      return null;
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      console.log('[AuthAPI] Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('[AuthAPI] SignOut error:', error.message);
      throw error;
    }
  },

  /**
   * Password reset
   */
  async resetPassword(email: string) {
    try {
      console.log('[AuthAPI] Resetting password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081'}/reset-password`,
        }
      );
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('[AuthAPI] ResetPassword error:', error.message);
      throw error;
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      console.log('[AuthAPI] Updating password');
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('[AuthAPI] UpdatePassword error:', error.message);
      throw error;
    }
  },
};

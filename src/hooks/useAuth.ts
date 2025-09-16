import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  phone: string;
  country: string;
  avatar_url?: string;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data && !error) {
      setProfile(data);
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    birthdate: string;
    phone: string;
    country: string;
  }) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) return { data: null, error: authError.message };

      if (authData.user) {
        // Create profile in users table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name: userData.name,
              email: userData.email,
              birthdate: userData.birthdate,
              phone: userData.phone,
              country: userData.country,
            }
          ])
          .select()
          .single();

        if (profileError) return { data: null, error: profileError.message };
        
        return { data: { user: authData.user, profile: profileData }, error: null };
      }

      return { data: authData, error: null };
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error: error?.message || null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
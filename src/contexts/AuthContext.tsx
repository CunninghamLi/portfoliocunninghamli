import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  username: string | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error('Error checking admin:', err);
      return false;
    }
  };

  const fetchUsername = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching username:', error);
        return null;
      }
      return data?.username || null;
    } catch (err) {
      console.error('Error fetching username:', err);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Check if email is confirmed (required for login)
        const emailConfirmed = newSession?.user?.email_confirmed_at || newSession?.user?.confirmed_at;
        
        // Only set session if email is confirmed
        if (newSession?.user && !emailConfirmed) {
          console.log('Email not confirmed yet');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setUsername(null);
          setLoading(false);
          return;
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(async () => {
            const adminStatus = await checkAdminRole(newSession.user.id);
            setIsAdmin(adminStatus);
            const uname = await fetchUsername(newSession.user.id);
            setUsername(uname);
          }, 0);
        } else {
          setIsAdmin(false);
          setUsername(null);
        }
        setLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      // Check if email is confirmed
      const emailConfirmed = initialSession?.user?.email_confirmed_at || initialSession?.user?.confirmed_at;
      
      if (initialSession?.user && !emailConfirmed) {
        console.log('Email not confirmed, signing out');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setUsername(null);
        setLoading(false);
        return;
      }

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const adminStatus = await checkAdminRole(initialSession.user.id);
        setIsAdmin(adminStatus);
        const uname = await fetchUsername(initialSession.user.id);
        setUsername(uname);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Immediately sign out to prevent auto-login before email confirmation
      // User must confirm email before they can log in
      if (data?.session) {
        await supabase.auth.signOut();
      }

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if it's an email confirmation issue
        if (error.message.toLowerCase().includes('email') && error.message.toLowerCase().includes('confirm')) {
          return { error: 'Please confirm your email address before logging in. Check your inbox for the confirmation link.' };
        }
        return { error: 'Invalid email or password' };
      }

      // Double check that email is confirmed
      const emailConfirmed = data?.user?.email_confirmed_at || data?.user?.confirmed_at;
      if (data?.user && !emailConfirmed) {
        await supabase.auth.signOut();
        return { error: 'Please confirm your email address before logging in. Check your inbox for the confirmation link.' };
      }

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoggedIn: !!user,
        isAdmin,
        username,
        loading,
        signUp,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

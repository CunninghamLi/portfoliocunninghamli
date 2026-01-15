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
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
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

  const signUp = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      // Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingProfile) {
        return { error: 'Username is already taken' };
      }

      // Generate a fake email from username for Supabase auth
      const fakeEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@portfolio.local`;

      const { error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            username,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      // First check if this is the admin user (cunninghamli uses gmail.com)
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', username)
        .maybeSingle();

      // Try with the fake email format first for new users
      const fakeEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@portfolio.local`;
      
      let { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      // If login fails and user exists in profiles, try with gmail format (for legacy admin)
      if (error && profile && username.toLowerCase() === 'cunninghamli') {
        const legacyEmail = `${username.toLowerCase()}@gmail.com`;
        const legacyResult = await supabase.auth.signInWithPassword({
          email: legacyEmail,
          password,
        });
        error = legacyResult.error;
      }

      if (error) {
        return { error: 'Invalid username or password' };
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

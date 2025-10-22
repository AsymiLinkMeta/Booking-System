import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userData } = await supabase
          .from('user')
          .select('id, email, role')
          .eq('email', session.user.email)
          .maybeSingle();

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            token: session.access_token
          });
          setRole(userData.role);
        }
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from('user')
            .select('id, email, role')
            .eq('email', session.user.email)
            .maybeSingle();

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              token: session.access_token
            });
            setRole(userData.role);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email, password, userRole) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userRole
          }
        }
      });

      if (authError) throw authError;

      const { error: userError } = await supabase
        .from('user')
        .insert([
          {
            email,
            password: 'hashed',
            role: userRole
          }
        ]);

      if (userError) throw userError;

      await login(email, password);
    } catch (error) {
      throw new Error(error.message || 'An error occurred during registration.');
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const { data: userData } = await supabase
        .from('user')
        .select('id, email, role')
        .eq('email', email)
        .maybeSingle();

      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          token: data.session.access_token
        });
        setRole(userData.role);
      }
    } catch (error) {
      throw new Error(error.message || 'An error occurred during login.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

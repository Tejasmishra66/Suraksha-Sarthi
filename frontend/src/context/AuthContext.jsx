import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clearAuthToken, login, signup, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

// Exposes auth state and login/logout helpers to the whole app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sdrf_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sdrf_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  // Performs login, persists the session, and returns the backend user record.
  async function signIn(credentials) {
    setLoading(true);
    try {
      const result = await login(credentials);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('sdrf_user', JSON.stringify(result.user));
      setAuthToken(result.token);
      return result.user;
    } finally {
      setLoading(false);
    }
  }

  // Signs up a user but does not automatically log them in (redirects to login).
  async function signUp(credentials) {
    setLoading(true);
    try {
      const result = await signup(credentials);
      return result;
    } finally {
      setLoading(false);
    }
  }

  // Removes local session state so the user returns to the login screen.
  function signOut() {
    setUser(null);
    setToken('');
    clearAuthToken();
    localStorage.removeItem('sdrf_user');
  }

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(token), signIn, signUp, signOut }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Returns the shared auth context for screens and guards.
export function useAuth() {
  return useContext(AuthContext);
}

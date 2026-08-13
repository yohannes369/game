// import { createContext, useContext, useState, useCallback, useMemo } from 'react';
// import api from '../api/axios';

// const AuthContext = createContext(null);

// function readStoredUser() {
//   try {
//     const raw = localStorage.getItem('user');
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(readStoredUser);
//   const [loading, setLoading] = useState(false);

//   const persistSession = useCallback((data) => {
//     localStorage.setItem('accessToken', data.accessToken);
//     localStorage.setItem('refreshToken', data.refreshToken);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     setUser(data.user);
//   }, []);

//   const login = useCallback(
//     async (username, password) => {
//       setLoading(true);
//       try {
//         const { data } = await api.post('/auth/login', { username, password });
//         persistSession(data);
//         return data.user;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [persistSession]
//   );

//   const register = useCallback(async (username, password, fullName) => {
//     setLoading(true);
//     try {
//       const { data } = await api.post('/auth/register', { username, password, fullName });
//       return data;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');
//     try {
//       await api.post('/auth/logout', { refreshToken });
//     } catch {
//       // ignore network errors on logout
//     }
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//   }, []);

//   const value = useMemo(
//     () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
//     [user, loading, login, register, logout]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// }


import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback((data) => {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }

    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      setLoading(true);

      try {
        const { data } = await api.post('/auth/login', {
          username,
          password,
        });

        persistSession(data);

        return data.user;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (username, password, fullName) => {
      setLoading(true);

      try {
        const { data } = await api.post('/auth/register', {
          username,
          password,
          fullName,
        });

        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await api.post('/auth/logout', {
          refreshToken,
        });
      }
    } catch {
      // Ignore logout network errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}


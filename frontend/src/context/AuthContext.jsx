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


// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useMemo,
// } from 'react';
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
//     if (data.accessToken) {
//       localStorage.setItem('accessToken', data.accessToken);
//     }

//     if (data.refreshToken) {
//       localStorage.setItem('refreshToken', data.refreshToken);
//     }

//     if (data.user) {
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setUser(data.user);
//     }
//   }, []);

//   const login = useCallback(
//     async (username, password) => {
//       setLoading(true);

//       try {
//         const { data } = await api.post('/auth/login', {
//           username,
//           password,
//         });

//         persistSession(data);

//         return data.user;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [persistSession]
//   );

//   const register = useCallback(
//     async (username, password, fullName) => {
//       setLoading(true);

//       try {
//         const { data } = await api.post('/auth/register', {
//           username,
//           password,
//           fullName,
//         });

//         return data;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const logout = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');

//     try {
//       if (refreshToken) {
//         await api.post('/auth/logout', {
//           refreshToken,
//         });
//       }
//     } catch {
//       // Ignore logout network errors
//     } finally {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');

//       setUser(null);
//     }
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       login,
//       register,
//       logout,
//       isAuthenticated: Boolean(user),
//     }),
//     [user, loading, login, register, logout]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error(
//       'useAuth must be used within an AuthProvider'
//     );
//   }

//   return context;
// }



// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useMemo,
// } from 'react';

// import api from '../api/axios';

// const AuthContext = createContext(null);

// // =========================================================
// // READ STORED USER
// // =========================================================

// function readStoredUser() {
//   try {
//     const raw = localStorage.getItem('user');

//     if (!raw) {
//       return null;
//     }

//     return JSON.parse(raw);
//   } catch (error) {
//     console.error('Failed to read stored user:', error);
//     return null;
//   }
// }

// // =========================================================
// // AUTH PROVIDER
// // =========================================================

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(readStoredUser);
//   const [loading, setLoading] = useState(false);

//   // =======================================================
//   // SAVE SESSION
//   // =======================================================

//   const persistSession = useCallback((data) => {
//     if (!data) {
//       return;
//     }

//     // Save access token
//     if (data.accessToken) {
//       localStorage.setItem(
//         'accessToken',
//         data.accessToken
//       );
//     }

//     // Save refresh token
//     if (data.refreshToken) {
//       localStorage.setItem(
//         'refreshToken',
//         data.refreshToken
//       );
//     }

//     // Save user
//     if (data.user) {
//       localStorage.setItem(
//         'user',
//         JSON.stringify(data.user)
//       );

//       setUser(data.user);
//     }
//   }, []);

//   // =======================================================
//   // LOGIN
//   // =======================================================

//   const login = useCallback(
//     async (username, password) => {
//       setLoading(true);

//       try {
//         const cleanUsername = String(username || '').trim();

//         if (!cleanUsername) {
//           throw new Error('Username is required.');
//         }

//         if (!password) {
//           throw new Error('Password is required.');
//         }

//         const response = await api.post(
//           '/auth/login',
//           {
//             username: cleanUsername,
//             password,
//           }
//         );

//         const data = response.data;

//         // Save accessToken, refreshToken and user
//         persistSession(data);

//         return data.user;
//       } catch (error) {
//         console.error(
//           'Login error:',
//           error?.response?.data || error
//         );

//         throw error;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [persistSession]
//   );

//   // =======================================================
//   // REGISTER
//   // =======================================================

//   const register = useCallback(
//     async (
//       username,
//       password,
//       fullName,
//       phoneNumber,
//       location
//     ) => {
//       setLoading(true);

//       try {
//         const cleanUsername = String(username || '').trim();
//         const cleanFullName = String(fullName || '').trim();
//         const cleanPhoneNumber = String(
//           phoneNumber || ''
//         ).trim();
//         const cleanLocation = String(
//           location || ''
//         ).trim();

//         // Frontend validation
//         if (!cleanUsername) {
//           throw new Error('Username is required.');
//         }

//         if (!password) {
//           throw new Error('Password is required.');
//         }

//         if (password.length < 6) {
//           throw new Error(
//             'Password must be at least 6 characters.'
//           );
//         }

//         if (!cleanFullName) {
//           throw new Error('Full name is required.');
//         }

//         if (!cleanPhoneNumber) {
//           throw new Error('Phone number is required.');
//         }

//         // =================================================
//         // IMPORTANT
//         // Backend expects:
//         //
//         // req.body.phoneNumber
//         //
//         // NOT:
//         //
//         // req.body.phone_number
//         // =================================================

//         const response = await api.post(
//           '/auth/register',
//           {
//             username: cleanUsername,
//             password,
//             fullName: cleanFullName,
//             phoneNumber: cleanPhoneNumber,
//             location: cleanLocation || null,
//           }
//         );

//         const data = response.data;

//         return data;
//       } catch (error) {
//         console.error(
//           'Registration error:',
//           error?.response?.data || error
//         );

//         throw error;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // =======================================================
//   // LOGOUT
//   // =======================================================

//   const logout = useCallback(async () => {
//     const refreshToken =
//       localStorage.getItem('refreshToken');

//     try {
//       if (refreshToken) {
//         await api.post(
//           '/auth/logout',
//           {
//             refreshToken,
//           }
//         );
//       }
//     } catch (error) {
//       console.error(
//         'Logout error:',
//         error?.response?.data || error
//       );
//     } finally {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');

//       setUser(null);
//     }
//   }, []);

//   // =======================================================
//   // CONTEXT VALUE
//   // =======================================================

//   const value = useMemo(
//     () => ({
//       user,
//       loading,

//       login,
//       register,
//       logout,

//       isAuthenticated: Boolean(user),
//     }),
//     [
//       user,
//       loading,
//       login,
//       register,
//       logout,
//     ]
//   );

//   // =======================================================
//   // PROVIDER
//   // =======================================================

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // =========================================================
// // USE AUTH
// // =========================================================

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error(
//       'useAuth must be used within an AuthProvider'
//     );
//   }

//   return context;
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

// =========================================================
// READ STORED USER
// =========================================================

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user');

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read stored user:', error);

    localStorage.removeItem('user');

    return null;
  }
}

// =========================================================
// AUTH PROVIDER
// =========================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  // =======================================================
  // SAVE SESSION
  // =======================================================

  const persistSession = useCallback((data) => {
    if (!data) {
      return;
    }

    if (data.accessToken) {
      localStorage.setItem(
        'accessToken',
        data.accessToken
      );
    }

    if (data.refreshToken) {
      localStorage.setItem(
        'refreshToken',
        data.refreshToken
      );
    }

    if (data.user) {
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      setUser(data.user);
    }
  }, []);

  // =======================================================
  // LOGIN
  // =======================================================

  const login = useCallback(
    async (username, password) => {
      setLoading(true);

      try {
        const cleanUsername = String(
          username || ''
        ).trim();

        if (!cleanUsername) {
          throw new Error('Username is required.');
        }

        if (!password) {
          throw new Error('Password is required.');
        }

        const response = await api.post(
          '/auth/login',
          {
            username: cleanUsername,
            password,
          }
        );

        const data = response.data;

        if (!data) {
          throw new Error(
            'Invalid response from server.'
          );
        }

        persistSession(data);

        return data.user;
      } catch (error) {
        console.error(
          'Login error:',
          error?.response?.data || error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  // =======================================================
  // REGISTER
  // =======================================================

  const register = useCallback(
    async (
      username,
      password,
      fullName,
      phoneNumber,
      location
    ) => {
      setLoading(true);

      try {
        const cleanUsername = String(
          username || ''
        ).trim();

        const cleanFullName = String(
          fullName || ''
        ).trim();

        const cleanPhoneNumber = String(
          phoneNumber || ''
        ).trim();

        const cleanLocation = String(
          location || ''
        ).trim();

        // -------------------------------
        // Frontend validation
        // -------------------------------

        if (!cleanUsername) {
          throw new Error(
            'Username is required.'
          );
        }

        if (!password) {
          throw new Error(
            'Password is required.'
          );
        }

        if (password.length < 6) {
          throw new Error(
            'Password must be at least 6 characters.'
          );
        }

        if (!cleanFullName) {
          throw new Error(
            'Full name is required.'
          );
        }

        if (!cleanPhoneNumber) {
          throw new Error(
            'Phone number is required.'
          );
        }

        // -------------------------------
        // Registration request
        // -------------------------------

        const payload = {
          username: cleanUsername,
          password,
          fullName: cleanFullName,
          phoneNumber: cleanPhoneNumber,
          location: cleanLocation || null,
        };

        console.log(
          'Registration payload:',
          {
            ...payload,
            password: '********',
          }
        );

        const response = await api.post(
          '/auth/register',
          payload
        );

        const data = response.data;

        if (!data) {
          throw new Error(
            'Invalid response from server.'
          );
        }

        return data;
      } catch (error) {
        console.error(
          'Registration error:',
          error?.response?.data || error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = useCallback(async () => {
    const refreshToken =
      localStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await api.post(
          '/auth/logout',
          {
            refreshToken,
          }
        );
      }
    } catch (error) {
      console.error(
        'Logout error:',
        error?.response?.data || error
      );
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);
    }
  }, []);

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
    ]
  );

  // =======================================================
  // PROVIDER
  // =======================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
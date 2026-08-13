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
//         const { data } = await api.post('/auth/login', {
//           username,
//           password
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
//     async (
//       username,
//       password,
//       fullName,
//       location
//     ) => {

//       setLoading(true);

//       try {

//         const { data } = await api.post(
//           '/auth/register',
//           {
//             username,
//             password,
//             fullName,
//             location
//           }
//         );

//         return data;

//       } finally {
//         setLoading(false);
//       }

//     },
//     []
//   );



//   const changePassword = useCallback(
//     async (
//       currentPassword,
//       newPassword
//     ) => {

//       setLoading(true);

//       try {

//         const { data } = await api.post(
//           '/auth/change-password',
//           {
//             currentPassword,
//             newPassword
//           }
//         );

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

//       await api.post(
//         '/auth/logout',
//         {
//           refreshToken
//         }
//       );

//     } catch {
//       // ignore logout errors
//     }


//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');

//     setUser(null);

//   }, []);



//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       login,
//       register,
//       changePassword,
//       logout,
//       isAuthenticated: !!user
//     }),
//     [
//       user,
//       loading,
//       login,
//       register,
//       changePassword,
//       logout
//     ]
//   );


//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



// export function useAuth() {

//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error(
//       'useAuth must be used within an AuthProvider'
//     );
//   }

//   return ctx;
// }

import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://game-qcad.onrender.com';

const api = axios.create({
  baseURL: API_URL.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add access token to authenticated requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, try refreshing it once
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.post(
          `${API_URL.replace(/\/+$/, '')}/auth/refresh`,
          {
            refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const newAccessToken = response.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
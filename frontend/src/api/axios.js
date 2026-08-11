// import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({ baseURL });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // On a 401, try once to refresh the access token using the stored refresh token,
// // then retry the original request. If refreshing fails, force a logout.
// let refreshingPromise = null;

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         return Promise.reject(error);
//       }

//       try {
//         if (!refreshingPromise) {
//           refreshingPromise = axios
//             .post(`${baseURL}/auth/refresh`, { refreshToken })
//             .finally(() => {
//               refreshingPromise = null;
//             });
//         }
//         const { data } = await refreshingPromise;
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  // Without a timeout, a request to a dead/unreachable backend (server down,
  // asleep on a free host, wrong VITE_API_URL, silently-dropped CORS
  // preflight) hangs forever with no console error and the UI spins
  // indefinitely. This turns that into a normal rejected promise after 15s
  // so callers' catch blocks (and loading states) actually resolve.
  timeout: 15000,
});

// Add access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token handling
let refreshingPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/')
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        if (!refreshingPromise) {
          refreshingPromise = axios
            .post(
              `${baseURL}/auth/refresh`,
              { refreshToken },
              {
                withCredentials: true,
              }
            )
            .finally(() => {
              refreshingPromise = null;
            });
        }

        const { data } = await refreshingPromise;

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
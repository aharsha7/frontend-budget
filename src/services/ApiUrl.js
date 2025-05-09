import axios from "axios";

const ApiUrl = axios.create({
  baseURL: "http://localhost:5000/api || https://backend-tracker-copy-6.onrender.com",
  withCredentials: true,
  // baseURL: "http://127.0.0.1:5000/",
});

// Request Interceptor
// ApiUrl.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export default ApiUrl;




// import axios from 'axios';

// // Create axios instance with baseURL
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // Update with your actual API base URL
// });

// // Add request interceptor to automatically add tokens to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('user_id');
      
//       // Redirect to login page
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

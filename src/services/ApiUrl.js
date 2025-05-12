// import axios from "axios";

// const ApiUrl = axios.create({
//   baseURL: "http://localhost:5000/api/",
//   withCredentials: true,
//   // baseURL: "http://127.0.0.1:5000/",
// });

// export default ApiUrl;

// import axios from 'axios';

// const API_BASE_URL = "https://your-backend-service.onrender.com";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,  // if you’re using cookies/session
// });

// export default api;

// src/services/ApiUrl.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to catch 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;

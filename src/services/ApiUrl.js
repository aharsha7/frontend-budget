import axios from "axios";

const ApiUrl = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "http://127.0.0.1:5000/",
});

export default ApiUrl;

ApiUrl.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
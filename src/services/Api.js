import axios from "axios";

const Api = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "http://127.0.0.1:5000",
});

export default Api;

// Api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = token;
//   }
//   return config;
// });

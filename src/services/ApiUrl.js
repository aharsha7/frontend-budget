// import axios from "axios";

// const ApiUrl = axios.create({
//   baseURL: "https://backend-tracker-copy-6.onrender.com",
//   withCredentials: true,
//   // baseURL: "http://127.0.0.1:5000/",
// });

// export default ApiUrl;


import axios from 'axios';

const API_BASE_URL = "https://your-backend-service.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // if you’re using cookies/session
});

export default api;

import axios from "axios";

const ApiUrl = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "http://127.0.0.1:5000/",
});

export default ApiUrl;

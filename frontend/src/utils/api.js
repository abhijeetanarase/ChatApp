import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "./constants";

// Create the Axios instance
const api = axios.create({
  baseURL: baseUrl, // Replace with your actual backend URL
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Only show toast for non-GET requests
    if (response?.data?.message && response.config.method !== "get") {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const message = error?.response?.data?.message || "Something went wrong";
    toast.error(message); // Uncomment if you want to show error toasts
    return Promise.reject(error);
  }
);

export default api;

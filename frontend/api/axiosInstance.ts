import axios from "axios";
import { refreshAccessToken } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor to add the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the error is due to an expired access token (401)
    if (
      error.response.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops
      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshAccessToken(refreshToken);

        // Update tokens in local storage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the authorization header for the original request
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        console.error("Failed to refresh token. Logging out...", refreshError);
        // Implement a logout function
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

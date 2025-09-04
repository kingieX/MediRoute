import axios from "axios";
import { AuthResponse, RefreshResponse, User, UserCredentials } from "./types";
import axiosInstance from "./axiosInstance";

// Access the environment variable securely
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Handles user login by sending credentials to the backend.
 *
 * @param {UserCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} The authentication tokens and user details.
 * @throws {Error} If the login request fails or returns an error.
 */
export const loginUser = async (
  credentials: UserCredentials
): Promise<AuthResponse> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not defined in environment variables.");
  }

  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Login API Error:", errorData);
      throw new Error(
        errorData.error || "Login failed. Please check your credentials."
      );
    } else {
      console.error("Login API Error:", error);
      throw new Error("An unexpected error occurred during login.");
    }
  }
};

/**
 * Refreshes the access token using a valid refresh token.
 *
 * @param {string} refreshToken - The refresh token from localStorage.
 * @returns {Promise<RefreshResponse>} The new access and refresh tokens.
 * @throws {Error} If the refresh token is invalid or expired.
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshResponse> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not defined in environment variables.");
  }

  try {
    const response = await axios.post<RefreshResponse>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Token refresh API Error:", errorData);
      throw new Error(
        errorData.error || "Session expired. Please log in again."
      );
    } else {
      console.error("Token refresh API Error:", error);
      throw new Error("An unexpected error occurred during token refresh.");
    }
  }
};

// --- New function for forgot password functionality ---
/**
 * Sends a password reset request for a given email address.
 *
 * @param {string} email - The user's email address.
 * @returns {Promise<{ message: string }>} A success message.
 * @throws {Error} If the request fails.
 */
export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not defined in environment variables.");
  }

  try {
    // We use the normal axios instance here because this is an unauthenticated route
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}/auth/forgot-password`,
      { email }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      throw new Error(
        errorData.error || "Failed to process forgot password request."
      );
    } else {
      console.error("Forgot password API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Resets the user's password using a valid reset token.
 *
 * @param {string} token - The password reset token from the URL.
 * @param {string} newPassword - The user's new password.
 * @returns {Promise<{ message: string }>} A success message.
 * @throws {Error} If the token is invalid or the request fails.
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not defined in environment variables.");
  }

  try {
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}/auth/reset-password`,
      { token, newPassword }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      throw new Error(
        errorData.error ||
          "Failed to reset password. Please check your token or try again."
      );
    } else {
      console.error("Reset password API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetches the authenticated user's profile information.
 * This is a protected route and requires a valid access token.
 *
 * @returns {Promise<User>} The user object containing id, name, email, and role.
 * @throws {Error} If the request fails or the token is invalid.
 */
export const getAuthenticatedUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get user API Error:", errorData);
      throw new Error(errorData.error || "Failed to fetch user data.");
    } else {
      console.error("Get user API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

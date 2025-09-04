// src/api/api.ts

import axios from "axios"; // Import the main axios library
import axiosInstance from "./axiosInstance";
import { AuthResponse, UserCredentials } from "./types";

// New interface for the refresh token response
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

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
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    // Correctly check if the error is an Axios error
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
  try {
    // Use the main axios library here to prevent interceptor loops
    const response = await axios.post<RefreshResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    // Correctly check if the error is an Axios error
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

import axios from "axios";
import {
  Alert,
  AuthResponse,
  DepartmentWithPatientCount,
  Patient,
  RefreshResponse,
  Shift,
  User,
  UserCredentials,
} from "./types";
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

/**
 * Updates a user's profile information.
 * @param {string} userId - The ID of the user to update.
 * @param {object} updatedData - The data to update.
 * @returns {Promise<User>} The updated user object.
 * @throws {Error} If the request fails.
 */
export const updateUserProfile = async (
  userId: string,
  updatedData: Partial<User>
): Promise<User> => {
  // console.log("UpdateUserProfile called with:", userId, updatedData);
  try {
    const response = await axiosInstance.put<User>(
      `/users/${userId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Update user profile API Error:", errorData);
      throw new Error(errorData.error || "Failed to update user profile.");
    } else {
      console.error("Update user profile API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Changes a user's password.
 * @param currentPassword The user's current password.
 * @param newPassword The new password to set.
 * @returns A promise that resolves with a success message or rejects on failure.
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to change password");
    }
    throw new Error("An unknown error occurred while changing password.");
  }
};
/**
 * Uploads a profile image for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} The URL of the uploaded image.
 * @throws {Error} If the upload fails.
 */
export const uploadProfileImage = async (
  userId: string,
  imageFile: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const response = await axiosInstance.post<{ url: string }>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Image upload API Error:", errorData);
      throw new Error(errorData.error || "Failed to upload image.");
    } else {
      console.error("Image upload API Error:", error);
      throw new Error("An unexpected error occurred during image upload.");
    }
  }
};

/**
 * Fetches a user's details by their ID.
 *
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<User>} The user object with all details.
 * @throws {Error} If the request fails or the user is not found.
 */
export const getUserDetails = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get user details API Error:", errorData);
      throw new Error(errorData.error || "Failed to fetch user details.");
    } else {
      console.error("Get user details API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetches all shifts. This is an ADMIN-only endpoint.
 *
 * @returns {Promise<Shift[]>} A list of all shifts with user and department details.
 * @throws {Error} If the request fails due to permissions or an internal error.
 */
export const getAllShifts = async (): Promise<Shift[]> => {
  try {
    const response = await axiosInstance.get<Shift[]>("/shifts");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get shifts API Error:", errorData);
      throw new Error(
        errorData.error || "Failed to fetch shifts. Check your permissions."
      );
    } else {
      console.error("Get shifts API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetches all patients and filters for those with a "WAITING" status.
 * This is an Admin/Doctor/Nurse endpoint.
 *
 * @returns {Promise<Patient[]>} A list of patients with status "WAITING".
 * @throws {Error} If the request to fetch patients fails.
 */
export const getWaitingPatients = async (): Promise<Patient[]> => {
  try {
    const response = await axiosInstance.get<Patient[]>("/patients");
    // Filter the patients on the client-side
    const waitingPatients = response.data.filter(
      (patient) => patient.status === "WAITING"
    );
    return waitingPatients;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get patients API Error:", errorData);
      throw new Error(
        errorData.error || "Failed to fetch patients. Check your permissions."
      );
    } else {
      console.error("Get patients API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetches all alerts and filters for those that are not resolved.
 * This is an Admin/Doctor/Nurse endpoint.
 *
 * @returns {Promise<Alert[]>} A list of alerts that are not yet resolved.
 * @throws {Error} If the request to fetch alerts fails.
 */
export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axiosInstance.get<Alert[]>("/alerts");
    // Filter alerts on the client-side to only include unresolved ones
    const activeAlerts = response.data.filter((alert) => !alert.resolved);
    return activeAlerts;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get alerts API Error:", errorData);
      throw new Error(
        errorData.error || "Failed to fetch alerts. Check your permissions."
      );
    } else {
      console.error("Get alerts API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetches all departments along with their current patient count.
 * This is an ADMIN-only endpoint.
 *
 * @returns {Promise<DepartmentWithPatientCount[]>} A list of departments with patient counts.
 * @throws {Error} If the request to fetch departments fails.
 */
export const getDepartmentsWithCount = async (): Promise<
  DepartmentWithPatientCount[]
> => {
  try {
    const response = await axiosInstance.get<DepartmentWithPatientCount[]>(
      "/departments"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as { error: string };
      console.error("Get departments API Error:", errorData);
      throw new Error(
        errorData.error ||
          "Failed to fetch departments. Check your permissions."
      );
    } else {
      console.error("Get departments API Error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

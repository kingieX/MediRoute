export interface UserCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "NURSE";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Authentication related TypeScript types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add other user fields as needed
}

export interface UserProfile {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiration: Date | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthError {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
  detail?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: AuthError;
}

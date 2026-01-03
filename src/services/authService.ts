import apiClient from './api';
import {
  setTokens,
  clearTokens,
  getRefreshToken,
  setAccessToken,
} from './tokenManager';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
  UserProfile,
  ApiError,
  AuthError,
} from '../types/auth';
import { AxiosError } from 'axios';

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login/', {
      email,
      password,
    });

    const { access, refresh, user } = response.data;

    // Store tokens securely
    await setTokens(access, refresh);

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Logout user - clear all tokens
 */
export async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint
    await apiClient.post('/auth/logout/');

    // Clear tokens from secure storage
    await clearTokens();
  } catch (error) {
    // Even if the API call fails, still clear local tokens
    await clearTokens();
    throw handleAuthError(error);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/token/refresh/', {
      refresh: refreshToken,
    });

    const { access } = response.data;

    // Store new access token
    await setAccessToken(access);

    return access;
  } catch (error) {
    // If refresh fails, clear all tokens
    await clearTokens();
    throw handleAuthError(error);
  }
}

/**
 * Get current user profile (legacy endpoint)
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>('/auth/me/');
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Get user profile details
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>('/auth/user/');
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Register new user
 */
export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    const { access, refresh } = response.data;

    // Store tokens securely
    await setTokens(access, refresh);

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await apiClient.post('/auth/password-reset/', { email });
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Confirm password reset with token
 */
export async function confirmPasswordReset(
  token: string,
  newPassword: string
): Promise<void> {
  try {
    await apiClient.post('/auth/password-reset/confirm/', {
      token,
      password: newPassword,
    });
  } catch (error) {
    throw handleAuthError(error);
  }
}

/**
 * Handle authentication errors and convert to ApiError format
 */
function handleAuthError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const authError: AuthError = error.response?.data || {};

    return {
      message:
        authError.detail ||
        authError.non_field_errors?.[0] ||
        error.message ||
        'An error occurred',
      status: error.response?.status,
      data: authError,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  };
}

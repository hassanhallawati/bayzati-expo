import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { TokenData } from '../types/auth';

// Keys for secure storage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_EXPIRATION_KEY = 'accessTokenExpiration';

// Token expiration time in minutes
const ACCESS_TOKEN_LIFETIME_MINUTES = 10;

/**
 * Platform-agnostic storage wrapper
 * Uses SecureStore for iOS/Android and AsyncStorage for web
 */
const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

/**
 * Store access token securely
 */
export async function setAccessToken(token: string): Promise<void> {
  await storage.setItem(ACCESS_TOKEN_KEY, token);

  // Calculate and store expiration time
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + ACCESS_TOKEN_LIFETIME_MINUTES);
  await storage.setItem(ACCESS_TOKEN_EXPIRATION_KEY, expirationDate.toISOString());
}

/**
 * Get access token from secure storage
 */
export async function getAccessToken(): Promise<string | null> {
  return await storage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Store refresh token securely
 */
export async function setRefreshToken(token: string): Promise<void> {
  await storage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
  return await storage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get access token expiration date
 */
export async function getAccessTokenExpiration(): Promise<Date | null> {
  const expirationStr = await storage.getItem(ACCESS_TOKEN_EXPIRATION_KEY);
  return expirationStr ? new Date(expirationStr) : null;
}

/**
 * Check if access token is expired or expiring soon (within 1 minute)
 */
export async function isTokenExpiringSoon(): Promise<boolean> {
  const expiration = await getAccessTokenExpiration();

  if (!expiration) {
    return true;
  }

  const now = new Date();
  const timeUntilExpiration = expiration.getTime() - now.getTime();
  const oneMinuteInMs = 60 * 1000;

  // Return true if token expires in less than 1 minute
  return timeUntilExpiration < oneMinuteInMs;
}

/**
 * Check if access token is completely expired
 */
export async function isTokenExpired(): Promise<boolean> {
  const expiration = await getAccessTokenExpiration();

  if (!expiration) {
    return true;
  }

  return new Date() > expiration;
}

/**
 * Store both tokens at once
 */
export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(refreshToken),
  ]);
}

/**
 * Get all token data
 */
export async function getTokenData(): Promise<TokenData> {
  const [accessToken, refreshToken, accessTokenExpiration] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
    getAccessTokenExpiration(),
  ]);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiration,
  };
}

/**
 * Clear all tokens from secure storage (logout)
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    storage.removeItem(ACCESS_TOKEN_KEY),
    storage.removeItem(REFRESH_TOKEN_KEY),
    storage.removeItem(ACCESS_TOKEN_EXPIRATION_KEY),
  ]);
}

/**
 * Check if user has valid tokens
 */
export async function hasValidTokens(): Promise<boolean> {
  const tokenData = await getTokenData();
  return !!(tokenData.accessToken && tokenData.refreshToken && !await isTokenExpired());
}

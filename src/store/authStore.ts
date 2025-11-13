import { create } from 'zustand';
import { User, AuthState } from '../types/auth';
import * as authService from '../services/authService';
import { hasValidTokens, clearTokens } from '../services/tokenManager';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(email, password);

      set({
        user: response.user || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Even if logout fails on backend, clear local state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  /**
   * Check authentication status on app startup
   */
  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const hasTokens = await hasValidTokens();

      if (hasTokens) {
        // Fetch current user data
        try {
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          // If fetching user fails, clear tokens
          await clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

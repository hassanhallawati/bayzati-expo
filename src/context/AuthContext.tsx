import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { YStack, Spinner, Text } from 'tamagui';

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Initializes authentication state on app startup
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await checkAuth();
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  // Show loading screen while checking authentication
  if (!isInitialized) {
    return (
      <YStack
        flex={1}
        backgroundColor="$primaryBg"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="large" color="$primaryGreen" />
        <Text
          fontSize={16}
          color="$primaryGreen"
          marginTop="$4"
        >
          Loading...
        </Text>
      </YStack>
    );
  }

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

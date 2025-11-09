import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Button,
  Input,
  ScrollView,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { useAuth } from "../src/hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Basic validation
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      // Call auth service login
      await login(email, password);

      // On success, navigate to dashboard
      router.replace("/dashboard");
    } catch (error: any) {
      // Handle field-specific errors from Django backend
      if (error.data) {
        if (error.data.email) {
          setEmailError(error.data.email[0]);
        }
        if (error.data.password) {
          setPasswordError(error.data.password[0]);
        }
        if (error.data.non_field_errors) {
          setGeneralError(error.data.non_field_errors[0]);
        }
      } else {
        setGeneralError(error.message || "Invalid email or password");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        flex={1}
        backgroundColor="$primaryBg"
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <YStack flex={1} justifyContent="space-between">
          {/* Main Content */}
          <YStack gap="$4">
            {/* Logo & Header */}
            <YStack alignItems="center" marginBottom="$4">
              <YStack
                width={68}
                height={100}
                marginBottom="$4"
              >
                <Image
                  source={{ uri: "https://www.figma.com/api/mcp/asset/0aa3050e-e5f5-4dbe-8880-427944e28e97" }}
                  style={{ width: 68, height: 100 }}
                  contentFit="contain"
                />
              </YStack>

              {/* Welcome Text */}
              <Text
                fontSize={30}
                fontWeight="700"
                color="$primaryDeepGreen"
                marginBottom="$2"
                textAlign="center"
              >
                Welcome Back
              </Text>
              <Text
                fontSize={16}
                color="$primaryGreen"
                textAlign="center"
              >
                Sign in to your pocket financial assistant
              </Text>
            </YStack>

            {/* Email Field */}
            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="500"
                color="$primaryGreen"
                marginLeft="$2"
              >
                Email Address
              </Text>
              <Input
                placeholder="Enter Your Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                height={48}
                borderRadius="$3"
                borderWidth={1}
                borderColor="$primaryDeepGreen"
                backgroundColor="rgba(250, 250, 250, 0.05)"
                color="$primaryGreen"
                placeholderTextColor="$textSecondary"
                fontSize={14}
                paddingHorizontal="$4"
              />
              {emailError ? (
                <Text fontSize={12} color="$error" marginLeft="$2">
                  {emailError}
                </Text>
              ) : null}
            </YStack>

            {/* Password Field */}
            <YStack gap="$2">
              <Text
                fontSize={14}
                fontWeight="500"
                color="$primaryGreen"
                marginLeft="$2"
              >
                Password
              </Text>
              <XStack
                height={48}
                borderRadius="$3"
                borderWidth={1}
                borderColor="$primaryDeepGreen"
                backgroundColor="rgba(250, 250, 250, 0.05)"
                alignItems="center"
                paddingLeft="$4"
                paddingRight="$2"
              >
                <Input
                  flex={1}
                  placeholder="Enter Your Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry={!showPassword}
                  borderWidth={0}
                  backgroundColor="transparent"
                  color="$primaryGreen"
                  placeholderTextColor="$textSecondary"
                  fontSize={14}
                  height={48}
                  paddingHorizontal={0}
                />
                <Button
                  size="$2"
                  chromeless
                  onPress={() => setShowPassword(!showPassword)}
                  icon={showPassword ? EyeOff : Eye}
                  color="$primaryGreen"
                  padding="$2"
                />
              </XStack>
              {passwordError ? (
                <Text fontSize={12} color="$error" marginLeft="$2">
                  {passwordError}
                </Text>
              ) : null}
            </YStack>

            {/* General Error Message */}
            {generalError ? (
              <Text fontSize={12} color="$error" textAlign="center" marginTop="$2">
                {generalError}
              </Text>
            ) : null}

            {/* Forgot Password */}
            <XStack justifyContent="flex-end">
              <Button
                chromeless
                size="$2"
                onPress={() => {
                  // Handle forgot password
                  console.log("Forgot password");
                }}
                padding={0}
              >
                <Text fontSize={12} color="$primaryGreen">
                  Forgot Password?
                </Text>
              </Button>
            </XStack>

            {/* Login Button */}
            <Button
              backgroundColor="$primaryGreen"
              color="$white"
              height={46}
              borderRadius="$3"
              fontSize={16}
              fontWeight="500"
              marginTop="$4"
              pressStyle={{
                backgroundColor: "$primaryDeepGreen",
              }}
              onPress={handleLogin}
              disabled={isLoading}
              icon={isLoading ? () => <Spinner color="$white" /> : undefined}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </YStack>

          {/* Sign Up Link */}
          <Pressable
            onPress={() => {
              // Handle sign up navigation
              console.log("Navigate to sign up");
            }}
          >
            <Text fontSize={13} color="$primaryGreen" textAlign="center" marginTop="$6">
              Don't have an account?{" "}
              <Text
                fontSize={13}
                color="$primaryGreen"
                fontWeight="500"
                textDecorationLine="underline"
              >
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import "@/global.css";
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

/**
 * Root layout component that loads custom fonts and manages the splash screen.
 * Initializes Plus Jakarta Sans font family with multiple weights for use throughout the app.
 */
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file");
}

export default function RootLayout() {
  useFonts({
    'sans-regular': require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    'sans-medium': require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    'sans-semibold': require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    'sans-bold': require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    'sans-extrabold': require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    'sans-light': require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}

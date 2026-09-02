import { Stack } from "expo-router";
import "@/global.css";

/**
 * Authentication layout component that provides navigation structure for auth screens.
 * Configures stack navigation for sign-in and sign-up flows.
 */
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

import { useAuth, useSignUp } from "@clerk/expo";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormErrors = { email?: string; password?: string; confirmPassword?: string; code?: string };

function clerkMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const value = error as { longMessage?: string; message?: string };
    return value.longMessage || value.message || fallback;
  }
  return fallback;
}

export default function SignUp() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const isBusy = fetchStatus === "fetching";

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-sans-medium text-muted-foreground">Connecting securely...</Text>
      </View>
    );
  }

  if (isSignedIn) return <Redirect href="/(tabs)" />;

  const finalize = async () => {
    const result = await signUp.finalize();
    if (result.error) {
      setFormError(clerkMessage(result.error, "Your account was created, but we could not finish signing you in."));
      return;
    }
    router.replace("/(tabs)");
  };

  const submitSignUp = async () => {
    const nextErrors: FormErrors = {};
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setFormErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    const result = await signUp.password({ emailAddress: normalizedEmail, password });
    if (result.error) {
      setFormError(clerkMessage(result.error, "We could not create your account. Please check your details."));
      return;
    }
    const codeResult = await signUp.verifications.sendEmailCode();
    if (codeResult.error) {
      setFormError(clerkMessage(codeResult.error, "We could not send a verification code. Please try again."));
      return;
    }
    setVerificationRequired(true);
  };

  const verifyEmail = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setFormErrors({ code: "Enter the 6-digit code from your email." });
      return;
    }
    setFormErrors({});
    setFormError("");
    const result = await signUp.verifications.verifyEmailCode({ code: code.trim() });
    if (result.error) {
      setFormError(clerkMessage(result.error, "That code is not valid. Check it and try again."));
      return;
    }
    if (signUp.status === "complete") await finalize();
    else setFormError("Your email is verified, but your account still needs more information.");
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView className="auth-screen" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="auth-scroll" contentContainerClassName="auth-content" keyboardShouldPersistTaps="handled">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark"><Text className="auth-logo-mark-text">R</Text></View>
              <View><Text className="auth-wordmark">Recurrly</Text><Text className="auth-wordmark-sub">Smart billing</Text></View>
            </View>
            <Text className="auth-title">{verificationRequired ? "Verify your email" : "Create your account"}</Text>
            <Text className="auth-subtitle">{verificationRequired ? `We sent a 6-digit code to ${email.trim()}.` : "A clearer way to stay ahead of every recurring bill"}</Text>
          </View>

          <View className="auth-card">
            {verificationRequired ? (
              <View className="auth-form">
                <View className="auth-field"><Text className="auth-label">Verification code</Text><TextInput className={formErrors.code ? "auth-input auth-input-error" : "auth-input"} value={code} onChangeText={setCode} placeholder="Enter 6-digit code" placeholderTextColor="#526079" keyboardType="number-pad" maxLength={6} autoFocus /></View>
                {formErrors.code ? <Text className="auth-error">{formErrors.code}</Text> : null}
                {formError ? <Text className="auth-error">{formError}</Text> : null}
                <Pressable className={isBusy ? "auth-button auth-button-disabled" : "auth-button"} onPress={verifyEmail} disabled={isBusy}><Text className="auth-button-text">{isBusy ? "Verifying..." : "Verify email"}</Text></Pressable>
                <Pressable className="auth-secondary-button" onPress={() => signUp.verifications.sendEmailCode()} disabled={isBusy}><Text className="auth-secondary-button-text">Send a new code</Text></Pressable>
                <Pressable onPress={() => { signUp.reset(); setVerificationRequired(false); setCode(""); setFormError(""); }}><Text className="auth-link">Change email address</Text></Pressable>
              </View>
            ) : (
              <View className="auth-form">
                <View className="auth-field"><Text className="auth-label">Email</Text><TextInput className={formErrors.email ? "auth-input auth-input-error" : "auth-input"} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#526079" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" /></View>
                {formErrors.email ? <Text className="auth-error">{formErrors.email}</Text> : null}
                <View className="auth-field"><Text className="auth-label">Password</Text><TextInput className={formErrors.password ? "auth-input auth-input-error" : "auth-input"} value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor="#526079" secureTextEntry textContentType="newPassword" /></View>
                {formErrors.password ? <Text className="auth-error">{formErrors.password}</Text> : null}
                <View className="auth-field"><Text className="auth-label">Confirm password</Text><TextInput className={formErrors.confirmPassword ? "auth-input auth-input-error" : "auth-input"} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" placeholderTextColor="#526079" secureTextEntry textContentType="newPassword" /></View>
                {formErrors.confirmPassword ? <Text className="auth-error">{formErrors.confirmPassword}</Text> : null}
                {errors.fields?.emailAddress?.message ? <Text className="auth-error">{errors.fields.emailAddress.message}</Text> : null}
                {errors.fields?.password?.message ? <Text className="auth-error">{errors.fields.password.message}</Text> : null}
                {formError ? <Text className="auth-error">{formError}</Text> : null}
                <Pressable className={isBusy ? "auth-button auth-button-disabled" : "auth-button"} onPress={submitSignUp} disabled={isBusy}><Text className="auth-button-text">{isBusy ? "Creating account..." : "Create account"}</Text></Pressable>
                <Text className="auth-helper">By continuing, you agree to keep your account information accurate and secure.</Text>
              </View>
            )}
            {!verificationRequired ? <View className="auth-link-row"><Text className="auth-link-copy">Already have an account?</Text><Link href="/(auth)/sign-in" asChild><Pressable><Text className="auth-link">Sign in</Text></Pressable></Link></View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
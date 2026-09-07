import { useAuth, useSignIn } from "@clerk/expo";
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

type FormErrors = { email?: string; password?: string; code?: string };

function clerkMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const value = error as { longMessage?: string; message?: string };
    return value.longMessage || value.message || fallback;
  }
  return fallback;
}

export default function SignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const finishSignIn = async () => {
    const result = await signIn.finalize();
    if (result.error) {
      setFormError(clerkMessage(result.error, "We could not finish signing you in. Please try again."));
      return;
    }
    router.replace("/(tabs)");
  };

  const submitCredentials = async () => {
    const nextErrors: FormErrors = {};
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setFormErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    const result = await signIn.password({ emailAddress: normalizedEmail, password });
    if (result.error) {
      setFormError(clerkMessage(result.error, "That email and password combination did not work."));
      return;
    }

    if (signIn.status === "complete") {
      await finishSignIn();
      return;
    }

    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const emailFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === "email_code");
      if (emailFactor || signIn.status === "needs_client_trust") {
        const codeResult = await signIn.mfa.sendEmailCode();
        if (codeResult.error) {
          setFormError(clerkMessage(codeResult.error, "We could not send your verification code."));
          return;
        }
        setVerificationRequired(true);
        return;
      }
    }

    setFormError("This account needs another verification step. Please contact support if you cannot continue.");
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setFormErrors({ code: "Enter the 6-digit code from your email." });
      return;
    }
    setFormErrors({});
    setFormError("");
    const result = await signIn.mfa.verifyEmailCode({ code: code.trim() });
    if (result.error) {
      setFormError(clerkMessage(result.error, "That code is not valid. Check it and try again."));
      return;
    }
    if (signIn.status === "complete") await finishSignIn();
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
            <Text className="auth-title">{verificationRequired ? "Check your email" : "Welcome back"}</Text>
            <Text className="auth-subtitle">
              {verificationRequired ? `Enter the code we sent to ${email.trim()}.` : "Sign in to continue managing your subscriptions"}
            </Text>
          </View>

          <View className="auth-card">
            {verificationRequired ? (
              <View className="auth-form">
                <View className="auth-field"><Text className="auth-label">Verification code</Text><TextInput className={formErrors.code ? "auth-input auth-input-error" : "auth-input"} value={code} onChangeText={setCode} placeholder="Enter 6-digit code" placeholderTextColor="#526079" keyboardType="number-pad" maxLength={6} autoFocus /></View>
                {formErrors.code ? <Text className="auth-error">{formErrors.code}</Text> : null}
                {formError ? <Text className="auth-error">{formError}</Text> : null}
                <Pressable className={isBusy ? "auth-button auth-button-disabled" : "auth-button"} onPress={verifyCode} disabled={isBusy}><Text className="auth-button-text">{isBusy ? "Verifying..." : "Verify and continue"}</Text></Pressable>
                <Pressable className="auth-secondary-button" onPress={() => signIn.mfa.sendEmailCode()} disabled={isBusy}><Text className="auth-secondary-button-text">Send a new code</Text></Pressable>
                <Pressable onPress={() => { signIn.reset(); setVerificationRequired(false); setCode(""); setFormError(""); }}><Text className="auth-link">Use a different email</Text></Pressable>
              </View>
            ) : (
              <View className="auth-form">
                <View className="auth-field"><Text className="auth-label">Email</Text><TextInput className={formErrors.email ? "auth-input auth-input-error" : "auth-input"} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#526079" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" /></View>
                {formErrors.email ? <Text className="auth-error">{formErrors.email}</Text> : null}
                <View className="auth-field"><Text className="auth-label">Password</Text><TextInput className={formErrors.password ? "auth-input auth-input-error" : "auth-input"} value={password} onChangeText={setPassword} placeholder="Your password" placeholderTextColor="#526079" secureTextEntry textContentType="password" /></View>
                {formErrors.password ? <Text className="auth-error">{formErrors.password}</Text> : null}
                {errors.fields?.identifier?.message ? <Text className="auth-error">{errors.fields.identifier.message}</Text> : null}
                {errors.fields?.password?.message ? <Text className="auth-error">{errors.fields.password.message}</Text> : null}
                {formError ? <Text className="auth-error">{formError}</Text> : null}
                <Pressable className={isBusy ? "auth-button auth-button-disabled" : "auth-button"} onPress={submitCredentials} disabled={isBusy}><Text className="auth-button-text">{isBusy ? "Signing in..." : "Sign in"}</Text></Pressable>
              </View>
            )}
            {!verificationRequired ? <View className="auth-link-row"><Text className="auth-link-copy">New to Recurrly?</Text><Link href="/(auth)/sign-up" asChild><Pressable><Text className="auth-link">Create an account</Text></Pressable></Link></View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
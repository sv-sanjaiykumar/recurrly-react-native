import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../../lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    const { data, error: signInError } = await AuthService.signInWithEmail(email.trim(), password);

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (data?.user) {
      router.replace('/(tabs)');
    }
  };

  const handleGitHubSignIn = async () => {
    setError('');
    setLoading(true);

    const { error: githubError } = await AuthService.signInWithGitHub();

    setLoading(false);

    if (githubError) {
      Alert.alert('GitHub sign-in failed', githubError.message);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView className="auth-screen" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="auth-scroll" contentContainerClassName="auth-content" keyboardShouldPersistTaps="handled">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark"><Text className="auth-logo-mark-text">R</Text></View>
              <View><Text className="auth-wordmark">Recurrly</Text><Text className="auth-wordmark-sub">Smart billing</Text></View>
            </View>
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput className="auth-input" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#526079" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput className="auth-input" value={password} onChangeText={setPassword} placeholder="Your password" placeholderTextColor="#526079" secureTextEntry textContentType="password" />
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable className={`auth-button ${loading ? 'auth-button-disabled' : ''}`} onPress={handleSignIn} disabled={loading}>
                <Text className="auth-button-text">{loading ? 'Signing in...' : 'Sign in'}</Text>
              </Pressable>

              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">or</Text>
                <View className="auth-divider-line" />
              </View>

              <Pressable className="auth-secondary-button" onPress={handleGitHubSignIn} disabled={loading}>
                <Text className="auth-secondary-button-text">Continue with GitHub</Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurrly?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
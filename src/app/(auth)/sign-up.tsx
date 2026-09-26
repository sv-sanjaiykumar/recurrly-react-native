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

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await AuthService.signUpWithEmail(email.trim(), password, fullName.trim());

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data?.user) {
      Alert.alert('Account created', 'Check your email to confirm your account.');
      router.replace('/(auth)/sign-in');
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
            <Text className="auth-title">Create your account</Text>
            <Text className="auth-subtitle">A clearer way to stay ahead of every recurring bill</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Full name</Text>
                <TextInput className="auth-input" value={fullName} onChangeText={setFullName} placeholder="Your name" placeholderTextColor="#526079" autoCapitalize="words" />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput className="auth-input" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#526079" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput className="auth-input" value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor="#526079" secureTextEntry textContentType="newPassword" />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Confirm password</Text>
                <TextInput className="auth-input" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" placeholderTextColor="#526079" secureTextEntry textContentType="newPassword" />
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable className={`auth-button ${loading ? 'auth-button-disabled' : ''}`} onPress={handleSignUp} disabled={loading}>
                <Text className="auth-button-text">{loading ? 'Creating account...' : 'Create account'}</Text>
              </Pressable>

              <Text className="auth-helper">By continuing, you agree to keep your account information accurate and secure.</Text>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

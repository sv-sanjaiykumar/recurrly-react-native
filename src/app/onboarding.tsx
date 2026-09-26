import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView className="onboarding-safe-area">
      <View className="onboarding-shell">
        <View className="onboarding-statusbar">
          <Text className="onboarding-time">9:41</Text>
          <View className="onboarding-status-icons">
            <View className="onboarding-signal onboarding-signal-1" />
            <View className="onboarding-signal onboarding-signal-2" />
            <View className="onboarding-signal onboarding-signal-3" />
            <View className="onboarding-battery" />
          </View>
        </View>

        <View className="onboarding-artboard">
          <View className="onboarding-piece onboarding-piece-1" />
          <View className="onboarding-piece onboarding-piece-2" />
          <View className="onboarding-piece onboarding-piece-3" />
          <View className="onboarding-piece onboarding-piece-4" />
          <View className="onboarding-piece onboarding-piece-5" />
          <View className="onboarding-piece onboarding-piece-6" />
          <View className="onboarding-piece onboarding-piece-7" />
          <View className="onboarding-piece onboarding-piece-8" />
          <View className="onboarding-piece onboarding-piece-9" />
          <View className="onboarding-piece onboarding-piece-10" />
          <View className="onboarding-piece onboarding-piece-11" />
          <View className="onboarding-piece onboarding-piece-12" />
        </View>

        <View className="onboarding-copy">
          <Text className="onboarding-title">Gain Financial Clarity</Text>
          <Text className="onboarding-subtitle">Track, analyze and cancel with ease</Text>
        </View>

        <Pressable className="onboarding-button" onPress={() => router.push('/(auth)/sign-in')}>
          <Text className="onboarding-button-text">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
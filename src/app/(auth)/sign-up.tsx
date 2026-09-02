import { View, Text } from 'react-native'
import { Link } from 'expo-router';

/**
 * Sign-up screen component for creating new user accounts.
 * Provides registration form and link to sign-in page.
 */
const Signup = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link href = "/(auth)/sign-in">Sign in</Link>
    </View>
  )
}

export default Signup
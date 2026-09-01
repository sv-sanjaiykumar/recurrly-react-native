import { View, Text } from 'react-native'
import { Link } from 'expo-router';

/**
 * Sign-in screen component that handles user authentication.
 * Provides login form and link to account creation.
 */
const Signin = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href = "/(auth)/sign-up">Create account</Link>
    </View>
  )
}

export default Signin
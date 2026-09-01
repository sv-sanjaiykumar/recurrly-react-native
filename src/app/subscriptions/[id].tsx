import { View, Text } from 'react-native'
import { Link , useLocalSearchParams } from 'expo-router'
import React from 'react'

/**
 * Subscription details screen component that displays information for a specific subscription.
 * Shows detailed information about the subscription identified by the route parameter.
 */
const SubscriptionDetails = () => {
  const {id} = useLocalSearchParams<{ id : string}>();
  return (
    <View>
      <Text>Subscription Details : { id }</Text>
    </View>
  )
}

export default SubscriptionDetails
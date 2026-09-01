import { View, Text } from 'react-native'
import { Link , useLocalSearchParams } from 'expo-router'
import React from 'react'

const SubscriptionDetails = () => {
  const {id} = useLocalSearchParams<{ id : string}>();
  return (
    <View>
      <Text>Subscription Details : { id }</Text>
    </View>
  )
}

export default SubscriptionDetails
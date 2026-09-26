import { Image, Text, View } from 'react-native';
import { fromCurrency } from "../lib/utils";


const UpcomingSubscriptionCard = ({name , price , daysLeft , icon , currency } : UpcomingSubscription) => {
  const safeCurrency = currency ?? 'USD';

  return (
    <View className = "upcoming-card">
        <View className = "upcoming-row">
            <Image source = {icon} className = "upcoming-icon"/>
            <View>
                <Text className = "upcoming-price">{fromCurrency(price , safeCurrency)}</Text>
                <Text className = "upcoming-meta" numberOfLines={1}>
                    {daysLeft > 1 ? `${daysLeft} days left` : "last day"} 
                </Text>
            </View>
        </View>

        <Text className = "upcoming-name" numberOfLines={1}>{name}</Text>
    </View>
  )
}

export default UpcomingSubscriptionCard
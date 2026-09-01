import { Tabs } from "expo-router";
import { tabs } from "@/constants/data";
import { View } from "react-native";
import { Image } from "react-native";
import clsx from "clsx"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors , components } from "@/constants/theme";

const tabBar = components.tabBar;

/**
 * Tab layout component that provides bottom tab navigation for the main app screens.
 * Renders custom styled tabs with icons for Home, Subscription, Insights, and Settings.
 */
const TabLayout = () => {
    const insets = useSafeAreaInsets();
    /**
     * Renders an individual tab icon with focus state styling.
     * @param {TabIconProps} props - Contains focused state and icon image source
     */
    const TabIcon = ({ focused, icon }: TabIconProps) => {
        return (
                <View className = "tabs-icon">
                    <View className = {clsx('tabs-pill' , focused && 'tabs-active')}>
                        <Image source = {icon} className = "tabs-glyph" />
                    </View>
                </View>
            )
    }
    return <Tabs screenOptions={{ 
            headerShown: false,
            tabBarShowLabel : false,
            tabBarStyle : {
                position : "absolute",
                bottom : Math.max(insets.bottom, tabBar.horizontalInset),
                height : tabBar.height,
                marginHorizontal : tabBar.horizontalInset,
                borderRadius : tabBar.radius,
                backgroundColor : colors.primary,
                borderTopWidth : 0,
                elevation : 0,
            },
            tabBarItemStyle : {
                paddingVertical : tabBar.height / 2 - tabBar.iconFrame / 1.6
            },
            tabBarIconStyle : {
                width : tabBar.iconFrame,
                height : tabBar.iconFrame,
                alignItems : "center",
            }
        }}
    >
        {tabs.map((tab) => (
            <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                    title: tab.title,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={tab.icon} />
                    ),
                }}
            />
        ))}
    </Tabs>
};

export default TabLayout;
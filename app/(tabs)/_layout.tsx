import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import { images } from "@/constants/images"
import { Tabs } from 'expo-router'
import { icons } from '@/constants/icons'

// Define the type for TabIcon props
interface TabIconProps {
    focused: boolean;
    icon: any;
    title: string;
    name: 'home' | 'map' | 'camera' | 'activities' | 'news'; // Required and restricted to valid values
}

// Define styles for each icon in focused and unfocused states
const iconStyles = {
    home: {
        unfocused: {
            width: 50,
            height: 50,
            tintColor: 'white',
        },
        focused: {
            width: 50,
            height: 50,
            tintColor: 'black',
        },
    },
    map: {
        unfocused: {
            width: 36,
            height: 36,
            tintColor: 'white',
        },
        focused: {
            width: 36,
            height: 36,
            marginleft: 20,
            tintColor: 'black',
        },
    },
    camera: {
        unfocused: {
            width: 36,
            height: 36,
            tintColor: 'white',
        },
        focused: {
            width: 36,
            height: 36,
            tintColor: 'black',
        },
    },
    activities: {
        unfocused: {
            width: 36,
            height: 36,
            tintColor: 'white',
        },
        focused: {
            width: 36,
            height: 36,
            tintColor: 'black',
        },
    },
    news: {
        unfocused: {
            width: 40,
            height: 40,
            tintColor: 'white',
        },
        focused: {
            width: 40,
            height: 40,
            tintColor: 'black',
        },
    },
};

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, title, name }) => {
    const style = focused ? iconStyles[name].focused : iconStyles[name].unfocused;

    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                style={{
                    flexDirection: 'row',
                    minWidth: 112,
                    minHeight: 56,
                    marginTop: 17.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                    overflow: 'hidden',
                }}
            >
                <Image
                    source={icon}
                    style={style} // Apple the specific style for the icon
                />
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        marginLeft: 0
                    }}
                >
                    {title}
                </Text>
            </ImageBackground>
        )
    }
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
                backgroundColor: 'transparent',
                borderRadius: 50,
            }}
        >
            <Image
                source={icon}
                style={style}
            />
        </View>
    )
}
const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#0f0d23",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 56,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0f0d23",
                }
            }}
        >
            {/* Hide header */}
            <Tabs.Screen
            name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title="Home"
                            name="home"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.map}
                            title="Map"
                            name="map"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Camera',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.camera}
                            title="Camera"
                            name="camera"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.activities}
                            title="Activities"
                            name="activities"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="news"
                options={{
                    title: 'News',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.news}
                            title="News"
                            name="news"
                        />
                    ),
                }}
            />
        </Tabs>
    )
}

export default _layout
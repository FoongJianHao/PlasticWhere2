// Import core React Native components for UI rendering
import { View, ImageBackground, Image } from 'react-native'
// Import React for defining components with JSX
import React from 'react'
// Import image assets (e.g., highlight background for focused tabs) from constants
import { images } from "@/constants/images"
// Import Tabs component from expo-router for bottom tab navigation
import { Tabs } from 'expo-router'
// Import icon assets (e.g., home, map icons) from constants
import { icons } from '@/constants/icons'
// Import DataProvider for sharing state via React Context
import { DataProvider } from '@/context/dataContext';

// Define TypeScript interface for TabIcon component props
interface TabIconProps {
    focused: boolean; // Indicates if the tab is currently active
    icon: any; // Image source for the icon (Note: Consider using ImageSourcePropType for better type safety)
    name: 'home' | 'map' | 'camera' | 'activities' | 'news'; // Restricts name to valid tab identifiers
}

// Define styles for each tab icon in focused and unfocused states
const iconStyles = {
    // Styles for the 'home' tab icon (Note: Comment incorrectly references 'bar chart')
    home: {
        unfocused: {
            width: 36, // Icon width in pixels
            height: 36, // Icon height in pixels
            tintColor: 'white', // White tint for unfocused state
        },
        focused: {
            width: 36,
            height: 36,
            tintColor: 'black', // Black tint for focused state
        },
    },
    // Styles for the 'map' tab icon
    map: {
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
    // Styles for the 'camera' tab icon
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
    // Styles for the 'activities' tab icon (Note: Comment incorrectly references 'home')
    activities: {
        unfocused: {
            width: 50, // Larger icon size compared to others
            height: 50,
            tintColor: 'white',
        },
        focused: {
            width: 50,
            height: 50,
            tintColor: 'black',
        },
    },
    // Styles for the 'news' tab icon
    news: {
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
};

// Define TabIcon component to render tab icons with conditional styling
const TabIcon: React.FC<TabIconProps> = ({ focused, icon, name }) => {
    // Select focused or unfocused style based on the focused prop
    const style = focused ? iconStyles[name].focused : iconStyles[name].unfocused;

    // Render icon with highlight background when focused
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight} // Background image for focused tabs
                style={{
                    flexDirection: 'row', // Fixed typo: was 'rowrow'; arranges children horizontally
                    width: 80, // Background width
                    height: 56, // Background height
                    marginTop: 17.5, // Fixed typo: was 17,5; adds top margin
                    justifyContent: 'center', // Center icon horizontally
                    alignItems: 'center', // Center icon vertically
                    borderRadius: 28, // Rounded corners for background
                    overflow: 'hidden', // Clip content to rounded shape
                }}
            >
                <Image
                    source={icon} // Icon image source
                    style={style} // Apply focused style (e.g., black tint)
                />
            </ImageBackground>
        )
    }
    // Render icon without background when unfocused
    return (
        <View
            style={{
                justifyContent: 'center', // Center icon horizontally
                alignItems: 'center', // Center icon vertically
                marginTop: 16, // Add top margin
                backgroundColor: 'transparent', // No background color
                borderRadius: 50, // Circular clip (may not be visible without background)
            }}
        >
            <Image
                source={icon} // Icon image source
                style={style} // Apply unfocused style (e.g., white tint)
            />
        </View>
    )
}

// Define the main layout component for tab navigation
const _layout = () => {
    return (
        // Wrap navigation in DataProvider to share state via Context
        <DataProvider>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false, // Hide tab labels, show icons only
                    tabBarItemStyle: {
                        width: "100%", // Fill available width
                        height: "100%", // Fill available height
                        justifyContent: "center", // Center content
                        alignItems: "center", // Center content
                    },
                    tabBarStyle: {
                        backgroundColor: "#0f0d23", // Dark background color
                        borderRadius: 50, // Rounded corners
                        marginHorizontal: 20, // Side margins
                        marginBottom: 36, // Bottom margin
                        height: 56, // Fixed height
                        position: "absolute", // Float above content
                        overflow: "hidden", // Clip content to rounded shape
                        borderWidth: 1, // Border width
                        borderColor: "#0f0d23", // Border color matches background
                    }
                }}
            >
                {/* Activities tab */}
                <Tabs.Screen
                    name="activities" // Route name (maps to app/activities.js or .tsx)
                    options={{
                        title: 'Activities', // Screen title for navigation
                        headerShown: false, // Hide header
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.home} // Note: Uses 'home' icon for 'activities' tab (potential mismatch)
                                name="activities" // Matches iconStyles key
                            />
                        )
                    }}
                />
                {/* Map tab */}
                <Tabs.Screen
                    name="map"
                    options={{
                        title: 'Map',
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.map}
                                name="map"
                            />
                        )
                    }}
                />
                {/* Camera tab */}
                <Tabs.Screen
                    name="camera"
                    options={{
                        title: 'Camera',
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.camera}
                                name="camera"
                            />
                        )
                    }}
                />
                {/* Home tab (default route) */}
                <Tabs.Screen
                    name="index" // Maps to root route (app/index.js or .tsx)
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.activities} // Note: Uses 'activities' icon for 'home' tab (potential mismatch)
                                name="home"
                            />
                        )
                    }}
                />
                {/* News tab */}
                <Tabs.Screen
                    name="news"
                    options={{
                        title: 'News',
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.news}
                                name="news"
                            />
                        ),
                    }}
                />
            </Tabs>
        </DataProvider>
    )
}

// Export the layout component for use by expo-router
export default _layout
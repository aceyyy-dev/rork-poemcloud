import { Tabs, useRouter } from "expo-router";
import { Home, Sparkles, Search, BookOpen, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { triggerHaptic } from "@/utils/haptics";

export default function TabLayout() {
  const { colors, isIllustrated } = useTheme();
  const { preferences } = useUser();

  const hideTabBar = !preferences.hasCompletedOnboarding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarStyle: hideTabBar ? { display: 'none' } : {
          backgroundColor: isIllustrated ? colors.tabBar.background : colors.tabBar.background,
          borderTopColor: isIllustrated ? 'transparent' : colors.borderLight,
          borderTopWidth: isIllustrated ? 0 : 1,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        sceneStyle: {
          backgroundColor: isIllustrated ? 'transparent' : colors.background,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
          marginTop: 4,
        },
        headerShown: false,
      }}
      screenListeners={{
        tabPress: () => {
          triggerHaptic('light');
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
          href: hideTabBar ? null : '/(tabs)',
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "For You",
          tabBarIcon: ({ color, focused }) => (
            <Sparkles size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
          href: hideTabBar ? null : '/(tabs)/feed',
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color, focused }) => (
            <Search size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
          href: hideTabBar ? null : '/(tabs)/browse',
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
          href: hideTabBar ? null : '/(tabs)/collections',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
          href: hideTabBar ? null : '/(tabs)/profile',
        }}
      />
    </Tabs>
  );
}

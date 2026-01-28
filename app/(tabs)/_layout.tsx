import { Tabs, useRouter } from "expo-router";
import { Home, Sparkles, Search, BookOpen, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "For You",
          tabBarIcon: ({ color, focused }) => (
            <Sparkles size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color, focused }) => (
            <Search size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
    </Tabs>
  );
}

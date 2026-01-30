import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { PurchasesProvider } from "@/contexts/PurchasesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TTSProvider } from "@/contexts/TTSContext";
import { PlaylistProvider } from "@/contexts/PlaylistContext";
import { ScreenCaptureProvider } from "@/contexts/ScreenCaptureContext";
import { BiometricProvider } from "@/contexts/BiometricContext";


SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore error on web or when splash screen is not available
});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors, transitionOpacity } = useTheme();
  
  return (
    <Animated.View style={[styles.container, { opacity: transitionOpacity }]}>
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="poem/[id]"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="poet/[id]"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="collection/[id]"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="country/[code]"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help-faq"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="playlist/[id]"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
        }}
      />
    </Stack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Ignore error on web or when splash screen is not available
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <PurchasesProvider>
              <AuthProvider>
                <BiometricProvider>
                  <UserProvider>
                    <PlaylistProvider>
                      <TTSProvider>
                        <ScreenCaptureProvider>
                          <RootLayoutNav />
                        </ScreenCaptureProvider>
                      </TTSProvider>
                    </PlaylistProvider>
                  </UserProvider>
                </BiometricProvider>
              </AuthProvider>
            </PurchasesProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

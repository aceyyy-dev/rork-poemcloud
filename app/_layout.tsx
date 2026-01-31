import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import FogBackground from "@/components/FogBackground";
import AppBackground from "@/components/AppBackground";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { WallpaperProvider, useWallpaper } from "@/contexts/WallpaperContext";
import { PurchasesProvider } from "@/contexts/PurchasesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TTSProvider } from "@/contexts/TTSContext";
import { PlaylistProvider } from "@/contexts/PlaylistContext";
import { ScreenCaptureProvider } from "@/contexts/ScreenCaptureContext";
import { BiometricProvider } from "@/contexts/BiometricContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { trpc, trpcClient } from "@/lib/trpc";


SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore error on web or when splash screen is not available
});

const queryClient = new QueryClient();

function RootBackground({ children }: { children: React.ReactNode }) {
  const { hasWallpaper } = useWallpaper();
  const { colors } = useTheme();

  return (
    <AppBackground>
      <View style={[styles.container, { backgroundColor: hasWallpaper ? 'transparent' : colors.background }]}>
        <FogBackground />
        {children}
      </View>
    </AppBackground>
  );
}

function RootLayoutNav() {
  const { colors, transitionOpacity } = useTheme();
  const { hasWallpaper } = useWallpaper();
  
  return (
    <RootBackground>
    <Animated.View style={[styles.container, { opacity: transitionOpacity }]}>
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: hasWallpaper ? 'transparent' : colors.background },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: hasWallpaper ? 'transparent' : colors.background },
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
    </RootBackground>
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

  const [trpcClientInstance] = useState(() => trpcClient);

  return (
    <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <WallpaperProvider>
              <PurchasesProvider>
                <AuthProvider>
                  <BiometricProvider>
                    <UserProvider>
                      <PlaylistProvider>
                        <TTSProvider>
                          <ScreenCaptureProvider>
                            <NotificationProvider>
                              <RootLayoutNav />
                            </NotificationProvider>
                          </ScreenCaptureProvider>
                        </TTSProvider>
                      </PlaylistProvider>
                    </UserProvider>
                  </BiometricProvider>
                </AuthProvider>
              </PurchasesProvider>
            </WallpaperProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

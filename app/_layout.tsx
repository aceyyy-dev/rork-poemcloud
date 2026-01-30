import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
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

function IllustratedBackground({ gradient, overlay }: { gradient: string[]; overlay: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.gradientBase, { backgroundColor: gradient[0] }]} />
      <View style={[styles.gradientLayer, { backgroundColor: gradient[1], top: '15%' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: gradient[2], top: '35%' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: gradient[3], top: '55%' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: gradient[4], top: '75%' }]} />
      <View style={[styles.overlayLayer, { backgroundColor: overlay }]} />
    </View>
  );
}

function RootLayoutNav() {
  const { colors, transitionOpacity, isIllustratedTheme, illustratedThemeData } = useTheme();
  
  const backgroundColor = isIllustratedTheme ? 'transparent' : colors.background;
  const headerBgColor = isIllustratedTheme ? 'transparent' : colors.background;
  
  return (
    <Animated.View style={[styles.container, { opacity: transitionOpacity }]}>
      {isIllustratedTheme && illustratedThemeData && (
        <IllustratedBackground 
          gradient={illustratedThemeData.backgroundGradient} 
          overlay={illustratedThemeData.overlayColor} 
        />
      )}
      {!isIllustratedTheme && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      )}
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: headerBgColor },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor },
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
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
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

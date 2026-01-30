import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
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

function IllustratedBackground({ imageUrl, overlay }: { imageUrl: string; overlay: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={{ uri: imageUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
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
          imageUrl={illustratedThemeData.backgroundImage} 
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
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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

import "react-native-get-random-values";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts as useInterFonts } from "@expo-google-fonts/inter";
import { Poppins_600SemiBold, Poppins_700Bold, useFonts as usePoppinsFonts } from "@expo-google-fonts/poppins";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { setAudioModeAsync } from "expo-audio";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync().catch(() => {});

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.navy950,
    card: colors.navy900,
    border: colors.navy600,
    primary: colors.cyan400,
    text: colors.white,
  },
};

export default function App() {
  const [poppinsLoaded] = usePoppinsFonts({ Poppins_600SemiBold, Poppins_700Bold });
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const authStatus = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  const fontsLoaded = poppinsLoaded && interLoaded;
  const ready = fontsLoaded && authStatus !== "hydrating";

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "duckOthers",
    }).catch(() => {});
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AlbumDetailScreen } from "../screens/detail/AlbumDetailScreen";
import { ArtistDetailScreen } from "../screens/detail/ArtistDetailScreen";
import { PlaylistDetailScreen } from "../screens/detail/PlaylistDetailScreen";
import { NowPlayingScreen } from "../screens/player/NowPlayingScreen";
import { useAuthStore } from "../store/authStore";
import { useLibraryStore } from "../store/libraryStore";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabs } from "./MainTabs";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const detailHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.navy900 },
  headerTintColor: colors.white,
  headerTitleStyle: { fontFamily: fontFamily.headingSemiBold, fontSize: 17 },
  headerShadowVisible: false,
  headerBackTitle: "",
} as const;

export function RootNavigator() {
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "signedIn") {
      useLibraryStore.getState().loadLikedSongs().catch(() => {});
    }
  }, [status]);

  if (status === "hydrating") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy950, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.cyan400} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === "signedOut" ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} options={{ ...detailHeaderOptions, title: "Album" }} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ ...detailHeaderOptions, title: "Artist" }} />
          <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} options={{ ...detailHeaderOptions, title: "Playlist" }} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="NowPlaying" component={NowPlayingScreen} />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

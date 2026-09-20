import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../navigation/types";
import { usePlayerStore } from "../store/playerStore";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { AlbumArt } from "./AlbumArt";

export function MiniPlayerBar() {
  // This bar is rendered inside the bottom tab navigator's custom tabBar, so
  // useNavigation() resolves to the tab navigator — reach up to the parent
  // root stack to open the full-screen Now Playing modal.
  const tabNavigation = useNavigation();
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isBuffering = usePlayerStore((s) => s.isBuffering);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const positionMillis = usePlayerStore((s) => s.positionMillis);
  const durationMillis = usePlayerStore((s) => s.durationMillis);

  if (!currentTrack) return null;

  const progress = durationMillis > 0 ? Math.min(positionMillis / durationMillis, 1) : 0;

  function openNowPlaying() {
    tabNavigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate("NowPlaying");
  }

  return (
    <Pressable style={styles.container} onPress={openNowPlaying}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.content}>
        <AlbumArt uri={currentTrack.coverArtUrl} size={40} radius={8} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentTrack.artistName}
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={togglePlayPause} style={styles.playButton}>
          {isBuffering ? (
            <ActivityIndicator color={colors.navy950} size="small" />
          ) : (
            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={colors.navy950} />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navy800,
    borderTopWidth: 1,
    borderColor: colors.navy600,
    overflow: "hidden",
  },
  progressTrack: {
    height: 2,
    backgroundColor: colors.navy600,
  },
  progressFill: {
    height: 2,
    backgroundColor: colors.cyan400,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 1,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cyan400,
    alignItems: "center",
    justifyContent: "center",
  },
});

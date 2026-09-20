import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlbumArt } from "../../components/AlbumArt";
import { GradientBackground } from "../../components/GradientBackground";
import { SeekBar } from "../../components/SeekBar";
import { useLibraryStore } from "../../store/libraryStore";
import { usePlayerStore } from "../../store/playerStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function NowPlayingScreen() {
  const navigation = useNavigation();
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isBuffering = usePlayerStore((s) => s.isBuffering);
  const positionMillis = usePlayerStore((s) => s.positionMillis);
  const durationMillis = usePlayerStore((s) => s.durationMillis);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);

  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  if (!currentTrack) {
    return (
      <View style={styles.flex}>
        <GradientBackground />
        <SafeAreaView style={styles.flex}>
          <View style={styles.header}>
            <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-down" size={28} color={colors.white} />
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing is playing right now.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const isLiked = Boolean(likedSongIds[currentTrack.id]);

  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={28} color={colors.white} />
          </Pressable>
          <Text style={styles.headerLabel}>Now Playing</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.artworkWrap}>
          <AlbumArt uri={currentTrack.coverArtUrl} size={320} radius={16} />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoText}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {currentTrack.artistName}
            </Text>
          </View>
          <Pressable hitSlop={12} onPress={() => toggleLike(currentTrack)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? colors.cyan400 : colors.gray300}
            />
          </Pressable>
        </View>

        <View style={styles.seekWrap}>
          <SeekBar positionMillis={positionMillis} durationMillis={durationMillis} onSeek={seekTo} />
        </View>

        <View style={styles.controlsRow}>
          <Pressable hitSlop={10} style={styles.sideIcon}>
            <Ionicons name="shuffle" size={22} color={colors.gray300} />
          </Pressable>
          <Pressable hitSlop={10} onPress={playPrevious}>
            <Ionicons name="play-skip-back" size={32} color={colors.white} />
          </Pressable>
          <Pressable style={styles.playButton} onPress={togglePlayPause} disabled={isBuffering}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color={colors.navy950} style={!isPlaying ? styles.playIconOffset : undefined} />
          </Pressable>
          <Pressable hitSlop={10} onPress={playNext}>
            <Ionicons name="play-skip-forward" size={32} color={colors.white} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.sideIcon}>
            <Ionicons name="repeat" size={22} color={colors.gray300} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy900 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerLabel: {
    ...typography.captionMedium,
    color: colors.gray300,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 28,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray300,
    textAlign: "center",
  },
  artworkWrap: {
    alignItems: "center",
    marginTop: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 36,
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray300,
    marginTop: 4,
  },
  seekWrap: {
    paddingHorizontal: 28,
    marginTop: 28,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 36,
    marginTop: 36,
  },
  sideIcon: {
    width: 32,
    alignItems: "center",
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.cyan400,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconOffset: {
    marginLeft: 3,
  },
});

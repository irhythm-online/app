import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { AlbumDetail } from "../../api/types";
import { AlbumArt } from "../../components/AlbumArt";
import { AsyncStateView } from "../../components/AsyncStateView";
import { GradientBackground } from "../../components/GradientBackground";
import { TrackRow } from "../../components/TrackRow";
import type { RootStackParamList } from "../../navigation/types";
import { useLibraryStore } from "../../store/libraryStore";
import { usePlayerStore } from "../../store/playerStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "AlbumDetail">;

export function AlbumDetailScreen({ route }: Props) {
  const { albumId } = route.params;
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAlbum(albumId);
        if (!cancelled) setAlbum(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this album.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [albumId]);

  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.flex} edges={["bottom"]}>
        <AsyncStateView loading={loading} error={error} isEmpty={!loading && !error && !album}>
          {album ? (
            <FlatList
              data={album.songs}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <View style={styles.header}>
                  <AlbumArt uri={album.coverArtUrl} size={180} />
                  <Text style={styles.title}>{album.title}</Text>
                  <Text style={styles.subtitle}>{album.artistName}</Text>
                </View>
              }
              ListEmptyComponent={<AsyncStateView loading={false} error={null} isEmpty emptyMessage="No tracks on this album yet." />}
              renderItem={({ item, index }) => (
                <TrackRow
                  song={item}
                  index={index}
                  isActive={currentTrack?.id === item.id}
                  isPlaying={isPlaying}
                  isLiked={Boolean(likedSongIds[item.id])}
                  onToggleLike={() => toggleLike(item)}
                  onPress={() => playTrack(item, album.songs)}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : null}
        </AsyncStateView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy900 },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.gray300,
    marginTop: 6,
  },
  listContent: {
    paddingBottom: 32,
  },
});

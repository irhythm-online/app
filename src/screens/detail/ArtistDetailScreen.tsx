import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { ArtistDetail } from "../../api/types";
import { AlbumArt } from "../../components/AlbumArt";
import { AsyncStateView } from "../../components/AsyncStateView";
import { GradientBackground } from "../../components/GradientBackground";
import { SectionHeader } from "../../components/SectionHeader";
import { TrackRow } from "../../components/TrackRow";
import type { RootStackParamList } from "../../navigation/types";
import { useLibraryStore } from "../../store/libraryStore";
import { usePlayerStore } from "../../store/playerStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "ArtistDetail">;

export function ArtistDetailScreen({ route }: Props) {
  const { artistId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
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
        const data = await api.getArtist(artistId);
        if (!cancelled) setArtist(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this artist.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [artistId]);

  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.flex} edges={["bottom"]}>
        <AsyncStateView loading={loading} error={error} isEmpty={!loading && !error && !artist}>
          {artist ? (
            <FlatList
              data={artist.songs}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View>
                  <View style={styles.header}>
                    <AlbumArt uri={artist.imageUrl} size={150} radius={75} />
                    <Text style={styles.title}>{artist.name}</Text>
                    {artist.bio ? (
                      <Text style={styles.bio} numberOfLines={3}>
                        {artist.bio}
                      </Text>
                    ) : null}
                  </View>

                  {artist.albums.length > 0 ? (
                    <View style={styles.albumsSection}>
                      <SectionHeader title="Albums" />
                      <FlatList
                        horizontal
                        data={artist.albums}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.albumsList}
                        renderItem={({ item }) => (
                          <Pressable
                            style={styles.albumCard}
                            onPress={() => navigation.push("AlbumDetail", { albumId: item.id })}
                          >
                            <AlbumArt uri={item.coverArtUrl} size={120} />
                            <Text style={styles.albumTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                          </Pressable>
                        )}
                      />
                    </View>
                  ) : null}

                  <SectionHeader title="Top songs" />
                </View>
              }
              renderItem={({ item, index }) => (
                <TrackRow
                  song={item}
                  index={index}
                  isActive={currentTrack?.id === item.id}
                  isPlaying={isPlaying}
                  isLiked={Boolean(likedSongIds[item.id])}
                  onToggleLike={() => toggleLike(item)}
                  onPress={() => playTrack(item, artist.songs)}
                />
              )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginTop: 20,
    textAlign: "center",
  },
  bio: {
    ...typography.caption,
    color: colors.gray300,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  albumsSection: {
    marginBottom: 12,
  },
  albumsList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  albumCard: {
    width: 120,
    marginRight: 14,
  },
  albumTitle: {
    ...typography.caption,
    color: colors.white,
    marginTop: 6,
  },
  listContent: {
    paddingBottom: 32,
  },
});

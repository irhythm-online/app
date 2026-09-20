import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../api/endpoints";
import { ApiError } from "../../api/client";
import type { Album, Artist, Song } from "../../api/types";
import { AsyncStateView } from "../../components/AsyncStateView";
import { BrowseCard } from "../../components/BrowseCard";
import { SectionHeader } from "../../components/SectionHeader";
import { SongCard } from "../../components/SongCard";
import type { RootStackParamList } from "../../navigation/types";
import { usePlayerStore } from "../../store/playerStore";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type BrowseEntry =
  | { kind: "album"; id: string; title: string; subtitle: string; imageUrl: string | null; data: Album }
  | { kind: "artist"; id: string; title: string; subtitle: string; imageUrl: string | null; data: Artist };

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const displayName = useAuthStore((s) => s.user?.displayName);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [browseItems, setBrowseItems] = useState<BrowseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const [recent, albums, artists] = await Promise.all([
        api.getRecentlyPlayed(),
        api.getAlbums(),
        api.getArtists(),
      ]);
      setRecentlyPlayed(recent);
      const albumEntries: BrowseEntry[] = albums.map((album) => ({
        kind: "album",
        id: album.id,
        title: album.title,
        subtitle: album.artistName,
        imageUrl: album.coverArtUrl,
        data: album,
      }));
      const artistEntries: BrowseEntry[] = artists.map((artist) => ({
        kind: "artist",
        id: artist.id,
        title: artist.name,
        subtitle: "Artist",
        imageUrl: artist.imageUrl,
        data: artist,
      }));
      setBrowseItems([...albumEntries, ...artistEntries]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your home feed. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openBrowseEntry(entry: BrowseEntry) {
    if (entry.kind === "album") {
      navigation.navigate("AlbumDetail", { albumId: entry.id });
    } else {
      navigation.navigate("ArtistDetail", { artistId: entry.id });
    }
  }

  return (
    <SafeAreaView style={styles.flex} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl tintColor={colors.cyan400} refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Feel Every Beat.</Text>
          {displayName ? <Text style={styles.subGreeting}>Welcome back, {displayName}</Text> : null}
        </View>

        <SectionHeader title="Recently played" />
        <AsyncStateView
          loading={loading}
          error={recentlyPlayed.length === 0 ? error : null}
          isEmpty={!loading && !error && recentlyPlayed.length === 0}
          emptyMessage="Nothing here yet — go find your next favorite song."
        >
          <FlatList
            horizontal
            data={recentlyPlayed}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => <SongCard song={item} onPress={() => playTrack(item, recentlyPlayed)} />}
          />
        </AsyncStateView>

        <View style={styles.browseSection}>
          <SectionHeader title="Browse" />
          <AsyncStateView
            loading={loading}
            error={browseItems.length === 0 ? error : null}
            isEmpty={!loading && !error && browseItems.length === 0}
            emptyMessage="No albums or artists in the catalog yet."
          >
            <View style={styles.grid}>
              {browseItems.map((entry) => (
                <View style={styles.gridItem} key={`${entry.kind}-${entry.id}`}>
                  <BrowseCard
                    title={entry.title}
                    subtitle={entry.subtitle}
                    imageUrl={entry.imageUrl}
                    circular={entry.kind === "artist"}
                    onPress={() => openBrowseEntry(entry)}
                  />
                </View>
              ))}
            </View>
          </AsyncStateView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy950 },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  greeting: {
    ...typography.h1,
    color: colors.white,
  },
  subGreeting: {
    ...typography.body,
    color: colors.gray300,
    marginTop: 4,
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  browseSection: {
    marginTop: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItem: {
    width: "45%",
  },
});

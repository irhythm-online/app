import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { Song } from "../../api/types";
import { AsyncStateView } from "../../components/AsyncStateView";
import { TrackRow } from "../../components/TrackRow";
import { useLibraryStore } from "../../store/libraryStore";
import { usePlayerStore } from "../../store/playerStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const DEBOUNCE_MS = 400;

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const songs = await api.searchSongs(trimmed);
        if (requestId === requestIdRef.current) {
          setResults(songs);
          setHasSearched(true);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError(err instanceof ApiError ? err.message : "Search failed. Try again.");
          setHasSearched(true);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <SafeAreaView style={styles.flex} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.gray500} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Songs, artists, albums"
            placeholderTextColor={colors.gray500}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      {!hasSearched && !loading ? (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Search for a song, artist, or album to start listening.</Text>
        </View>
      ) : (
        <AsyncStateView
          loading={loading}
          error={error}
          isEmpty={!loading && !error && results.length === 0}
          emptyMessage="No matches — try a different search."
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TrackRow
                song={item}
                isActive={currentTrack?.id === item.id}
                isPlaying={isPlaying}
                isLiked={Boolean(likedSongIds[item.id])}
                onToggleLike={() => toggleLike(item)}
                onPress={() => playTrack(item, results)}
              />
            )}
          />
        </AsyncStateView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy950 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.navy800,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.navy600,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
  },
  hint: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  hintText: {
    ...typography.body,
    color: colors.gray500,
    textAlign: "center",
  },
  list: {
    paddingBottom: 24,
  },
});

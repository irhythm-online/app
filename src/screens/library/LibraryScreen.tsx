import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { Playlist, Song } from "../../api/types";
import { AlbumArt } from "../../components/AlbumArt";
import { AsyncStateView } from "../../components/AsyncStateView";
import { TrackRow } from "../../components/TrackRow";
import type { RootStackParamList } from "../../navigation/types";
import { useLibraryStore } from "../../store/libraryStore";
import { usePlayerStore } from "../../store/playerStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { CreatePlaylistModal } from "./CreatePlaylistModal";

type Segment = "playlists" | "liked";

export function LibraryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [segment, setSegment] = useState<Segment>("playlists");

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [playlistsError, setPlaylistsError] = useState<string | null>(null);

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [likedLoading, setLikedLoading] = useState(true);
  const [likedError, setLikedError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  const loadPlaylists = useCallback(async () => {
    setPlaylistsLoading(true);
    setPlaylistsError(null);
    try {
      setPlaylists(await api.getPlaylists());
    } catch (err) {
      setPlaylistsError(err instanceof ApiError ? err.message : "Couldn't load your playlists.");
    } finally {
      setPlaylistsLoading(false);
    }
  }, []);

  const loadLikedSongs = useCallback(async () => {
    setLikedLoading(true);
    setLikedError(null);
    try {
      setLikedSongs(await useLibraryStore.getState().loadLikedSongs());
    } catch (err) {
      setLikedError(err instanceof ApiError ? err.message : "Couldn't load your liked songs.");
    } finally {
      setLikedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylists();
    loadLikedSongs();
  }, [loadPlaylists, loadLikedSongs]);

  async function handleCreatePlaylist(name: string, description: string) {
    const created = await api.createPlaylist({ name, description: description || undefined, isPublic: false });
    setPlaylists((prev) => [created, ...prev]);
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.flex} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <View style={styles.segmentRow}>
          <SegmentButton label="Playlists" active={segment === "playlists"} onPress={() => setSegment("playlists")} />
          <SegmentButton label="Liked Songs" active={segment === "liked"} onPress={() => setSegment("liked")} />
        </View>
      </View>

      {segment === "playlists" ? (
        <>
          <Pressable style={styles.createRow} onPress={() => setModalVisible(true)}>
            <View style={styles.createIcon}>
              <Ionicons name="add" size={20} color={colors.navy950} />
            </View>
            <Text style={styles.createText}>Create playlist</Text>
          </Pressable>
          <AsyncStateView
            loading={playlistsLoading}
            error={playlistsError}
            isEmpty={!playlistsLoading && !playlistsError && playlists.length === 0}
            emptyMessage="Nothing here yet — create your first playlist."
          >
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.playlistRow}
                  onPress={() => navigation.navigate("PlaylistDetail", { playlistId: item.id })}
                >
                  <AlbumArt uri={item.coverArtUrl} size={52} radius={10} />
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.playlistMeta} numberOfLines={1}>
                      {item.songIds.length} {item.songIds.length === 1 ? "song" : "songs"}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </AsyncStateView>
        </>
      ) : (
        <AsyncStateView
          loading={likedLoading}
          error={likedError}
          isEmpty={!likedLoading && !likedError && likedSongs.length === 0}
          emptyMessage="Nothing here yet — go find your next favorite song."
        >
          <FlatList
            data={likedSongs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TrackRow
                song={item}
                isActive={currentTrack?.id === item.id}
                isPlaying={isPlaying}
                isLiked
                onToggleLike={() => {
                  toggleLike(item);
                  setLikedSongs((prev) => prev.filter((s) => s.id !== item.id));
                }}
                onPress={() => playTrack(item, likedSongs)}
              />
            )}
          />
        </AsyncStateView>
      )}

      <CreatePlaylistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreatePlaylist}
      />
    </SafeAreaView>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
    </Pressable>
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
  segmentRow: {
    flexDirection: "row",
    backgroundColor: colors.navy800,
    borderRadius: 14,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: colors.navy600,
  },
  segmentLabel: {
    ...typography.bodyMedium,
    color: colors.gray300,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  createIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cyan400,
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  list: {
    paddingBottom: 24,
  },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 14,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  playlistMeta: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 2,
  },
});

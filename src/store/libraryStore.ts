import { create } from "zustand";
import { api } from "../api/endpoints";
import type { Song } from "../api/types";

interface LibraryState {
  likedSongIds: Record<string, boolean>;
  hasLoaded: boolean;
  loadLikedSongs: () => Promise<Song[]>;
  isLiked: (songId: string) => boolean;
  toggleLike: (song: Song) => Promise<void>;
}

/**
 * Centralizes "which songs are liked" so the heart icon stays in sync across
 * Search results, Library, Album/Artist/Playlist detail, and Now Playing —
 * without every screen re-fetching /me/liked-songs independently.
 */
export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedSongIds: {},
  hasLoaded: false,

  loadLikedSongs: async () => {
    const songs = await api.getLikedSongs();
    const likedSongIds: Record<string, boolean> = {};
    for (const song of songs) {
      likedSongIds[song.id] = true;
    }
    set({ likedSongIds, hasLoaded: true });
    return songs;
  },

  isLiked: (songId: string) => Boolean(get().likedSongIds[songId]),

  toggleLike: async (song: Song) => {
    const currentlyLiked = Boolean(get().likedSongIds[song.id]);
    set((state) => ({ likedSongIds: { ...state.likedSongIds, [song.id]: !currentlyLiked } }));
    try {
      if (currentlyLiked) {
        await api.unlikeSong(song.id);
      } else {
        await api.likeSong(song.id);
      }
    } catch {
      // Roll back the optimistic update if the request failed.
      set((state) => ({ likedSongIds: { ...state.likedSongIds, [song.id]: currentlyLiked } }));
    }
  },
}));

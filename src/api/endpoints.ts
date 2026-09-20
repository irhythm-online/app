import { apiClient } from "./client";
import type {
  Album,
  AlbumDetail,
  Artist,
  ArtistDetail,
  CreatePlaylistInput,
  PaginatedResponse,
  Playlist,
  PlaylistDetail,
  Song,
} from "./types";

export const api = {
  // Catalog
  getSongs: (params?: { limit?: number; cursor?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.cursor) query.set("cursor", params.cursor);
    const qs = query.toString();
    return apiClient.get<PaginatedResponse<Song>>(`/songs${qs ? `?${qs}` : ""}`);
  },
  getSong: (id: string) => apiClient.get<Song>(`/songs/${id}`),
  searchSongs: (q: string) => apiClient.get<Song[]>(`/songs/search?q=${encodeURIComponent(q)}`),

  getAlbums: () => apiClient.get<Album[]>("/albums"),
  getAlbum: (id: string) => apiClient.get<AlbumDetail>(`/albums/${id}`),

  getArtists: () => apiClient.get<Artist[]>("/artists"),
  getArtist: (id: string) => apiClient.get<ArtistDetail>(`/artists/${id}`),

  playSong: (id: string) => apiClient.post<void>(`/songs/${id}/play`, {}),

  // Me
  getRecentlyPlayed: () => apiClient.get<Song[]>("/me/recently-played"),
  getLikedSongs: () => apiClient.get<Song[]>("/me/liked-songs"),
  likeSong: (songId: string) => apiClient.put<void>(`/me/liked-songs/${songId}`),
  unlikeSong: (songId: string) => apiClient.delete<void>(`/me/liked-songs/${songId}`),

  getPlaylists: () => apiClient.get<Playlist[]>("/me/playlists"),
  createPlaylist: (input: CreatePlaylistInput) => apiClient.post<Playlist>("/me/playlists", input),
  getPlaylist: (id: string) => apiClient.get<PlaylistDetail>(`/playlists/${id}`),
  updatePlaylist: (id: string, input: Partial<CreatePlaylistInput>) =>
    apiClient.patch<Playlist>(`/playlists/${id}`, input),
  deletePlaylist: (id: string) => apiClient.delete<void>(`/playlists/${id}`),
  addSongToPlaylist: (playlistId: string, songId: string) =>
    apiClient.put<void>(`/playlists/${playlistId}/songs/${songId}`),
  removeSongFromPlaylist: (playlistId: string, songId: string) =>
    apiClient.delete<void>(`/playlists/${playlistId}/songs/${songId}`),
};

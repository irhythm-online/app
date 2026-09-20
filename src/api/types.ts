/**
 * Types mirroring API_CONTRACT.md. The backend is being built in parallel and
 * is not deployed yet, so a few response shapes are not 100% pinned down by
 * the contract doc — those are called out below with "Assumption:" comments.
 * They follow the most consistent reading of the contract and should be
 * trivial to adjust once the real backend responses are observable.
 */

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string | null;
  albumName: string | null;
  coverArtUrl: string;
  audioUrl: string;
  durationSeconds: number;
  genre: string;
  releaseDate: string;
  playCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverArtUrl: string;
  releaseDate: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

/** GET /v1/albums/:id — "includes resolved songs[]" per contract. */
export interface AlbumDetail extends Album {
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /v1/artists/:id — "includes albums[] and top songs[]" per contract. */
export interface ArtistDetail extends Artist {
  albums: Album[];
  songs: Song[];
}

export interface Playlist {
  id: string;
  ownerUserId: string;
  name: string;
  description: string | null;
  coverArtUrl: string | null;
  isPublic: boolean;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Assumption: GET /v1/playlists/:id resolves `songs[]` the same way album/artist
 * detail routes do, since the contract doesn't spell out playlist detail shape
 * explicitly but documents the same songIds-resolution pattern elsewhere.
 */
export interface PlaylistDetail extends Playlist {
  songs: Song[];
}

export interface CreatePlaylistInput {
  name: string;
  description?: string;
  isPublic: boolean;
}

/**
 * Assumption: paginated list envelope for GET /v1/songs?limit=&cursor=.
 * The contract says "paginated list, newest first" without specifying the
 * envelope field names — `items` + `nextCursor` is the most common shape for
 * a cursor-based Dynamo scan/query and is used here.
 */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string | null;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

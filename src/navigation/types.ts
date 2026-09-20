export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ConfirmEmail: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AlbumDetail: { albumId: string };
  ArtistDetail: { artistId: string };
  PlaylistDetail: { playlistId: string };
  NowPlaying: undefined;
};

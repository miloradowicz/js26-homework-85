export interface ArtistMutation {
  name: string;
  photoUrl: string | null;
  description: string | null;
}

export interface AlbumMutation {
  title: string;
  artist: string;
  year: number;
  coverUrl: string | null;
}

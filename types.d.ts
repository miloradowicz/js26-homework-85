export interface ArtistMutation {
  name: string?;
  photoUrl: string?;
  description: string?;
}

export interface AlbumMutation {
  title: string?;
  artist: string?;
  year: number?;
  coverUrl: string?;
}

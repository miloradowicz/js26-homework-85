export interface Artist {
  _id: string;
  name: string;
  photoUrl: string | null;
  description: string | null;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  year: number;
  coverUrl: string | null;
  trackCount?: number;
}

export type AlbumBody = Omit<Album, 'artist'>;

export type TrackBody = Omit<Track, 'album'>;

export type PopulatedAlbum = Omit<Album, 'artist'> & {
  artist: Artist;
};

export interface AlbumSet {
  albums: AlbumBody[] | Album[];
  artist?: Artist;
}

export interface TrackSet {
  tracks: TrackBody[] | Track[];
  album?: PopulatedAlbum;
}

export interface Track {
  _id: string;
  title: string;
  album: string;
  trackNum: number;
  length: string | null;
}

export interface Error {
  error: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };

  message: string;
  name: string;
  _message: string;
}

export interface Artist {
  _id: string;
  name: string;
  photoUrl: string | null;
  description: string | null;
  isPublished: boolean;
  uploadedBy: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  year: number;
  coverUrl: string | null;
  trackCount: number;
  isPublished: boolean;
  uploadedBy: string;
}

export interface Track {
  _id: string;
  title: string;
  album: string;
  trackNum: number;
  length: string | null;
  youTubeUrl: string | null;
  isPublished: boolean;
  uploadedBy: string;
}

export interface TrackHistoryRecord {
  _id: string;
  track: TrackBody;
  album: AlbumBody;
  artist: Artist;
  user: string;
  date: string;
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
  album?: Album;
  artist?: Artist;
}

export interface GenericError {
  error: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
}

export interface AuthenticationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
}

export interface User {
  _id: string;
  username: string;
  role: 'user' | 'admin';
  token: string;
}

export interface Session {
  user: User | null;
}

export interface SignInMutation {
  username: string;
  password: string;
}

export interface SignUpMutation {
  username: string;
  password: string;
}

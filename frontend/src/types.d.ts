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
  artist: string;
  trackNum: number;
  length: string | null;
  youTubeUrl: string | null;
  isPublished: boolean;
  uploadedBy: string;
}

export interface TrackHistoryRecord {
  _id: string;
  track: Track;
  album: Album;
  artist: Artist;
  user: string;
  date: string;
}

export interface PopulatedBase {
  uploadedBy: StrippedUser | null;
}

export type PopulatedArtist = Omit<Artist, 'uploadedBy'> & PopulatedBase;

export type PopulatedAlbum = Omit<Album, 'artist' | 'uploadedBy'> & {
  artist: Artist | null;
} & PopulatedBase;

export type PopulatedTrack = Omit<Track, 'album' | 'uploadedBy'> & {
  album: Album | null;
  artist: Artist | null;
} & PopulatedBase;

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
  displayName: string;
  avatarUrl: string | null;
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
  displayName: string;
  avatar: File | null;
}

export type StrippedUser = Omit<User, 'role' | 'token'>;

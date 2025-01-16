export interface Artist {
  _id: string;
  name: string;
  photoUrl: string | null;
  description: string | null;
}

export interface Album {
  _id: string;
  title: string;
  artist: Artist;
  year: number;
  coverUrl: string | null;
  trackCount?: number;
}

export interface Track {
  _id: string;
  title: string;
  album: Album;
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

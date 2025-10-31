export interface Track {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  previewUrl: string;
  duration: number;
  releaseDate?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Album {
  id: string;
  name: string;
  artistName: string;
  artworkUrl: string;
  releaseDate?: string;
  trackCount?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverUrl?: string;
  createdAt: string;
}

export interface PlayHistory {
  track: Track;
  playedAt: string;
}

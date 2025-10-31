import React, { createContext, useContext, useState, useEffect } from "react";
import { Track, Playlist } from "@/types/music";

interface LibraryContextType {
  likedSongs: Track[];
  playlists: Playlist[];
  addLikedSong: (track: Track) => void;
  removeLikedSong: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const LIKED_SONGS_KEY = "spotify-liked-songs";
const PLAYLISTS_KEY = "spotify-playlists";

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedLiked = localStorage.getItem(LIKED_SONGS_KEY);
    const savedPlaylists = localStorage.getItem(PLAYLISTS_KEY);

    if (savedLiked) {
      setLikedSongs(JSON.parse(savedLiked));
    }
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const addLikedSong = (track: Track) => {
    setLikedSongs(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      return [track, ...prev];
    });
  };

  const removeLikedSong = (trackId: string) => {
    setLikedSongs(prev => prev.filter(t => t.id !== trackId));
  };

  const isLiked = (trackId: string) => {
    return likedSongs.some(t => t.id === trackId);
  };

  const createPlaylist = (name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      tracks: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          if (p.tracks.some(t => t.id === track.id)) return p;
          return { ...p, tracks: [...p.tracks, track] };
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
        }
        return p;
      })
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        likedSongs,
        playlists,
        addLikedSong,
        removeLikedSong,
        isLiked,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }
  return context;
}

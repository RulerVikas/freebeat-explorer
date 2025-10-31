import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Track, PlayHistory } from "@/types/music";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  playHistory: PlayHistory[];
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  addToQueue: (tracks: Track[], startIndex?: number) => void;
  shuffle: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playHistory, setPlayHistory] = useState<PlayHistory[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, queue]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    setCurrentTrack(track);
    audioRef.current.src = track.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);

    // Add to play history
    setPlayHistory(prev => [
      { track, playedAt: new Date().toISOString() },
      ...prev.slice(0, 49), // Keep last 50
    ]);
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex]);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const addToQueue = (tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    playTrack(tracks[startIndex]);
  };

  const shuffle = () => {
    if (queue.length === 0) return;
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    playTrack(shuffled[0]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        queue,
        currentIndex,
        playHistory,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setVolume,
        seekTo,
        addToQueue,
        shuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}

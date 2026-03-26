import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";
import { Song } from "./types";

interface AudioPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffleEnabled: boolean;
  queue: Song[];
  currentTime: number;
  duration: number;
}

interface AudioPlayerActions {
  playSong: (song: Song) => void;
  playAll: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
  setAllSongs: (songs: Song[]) => void;
  onTimeUpdate: (current: number, total: number) => void;
  onVideoEnded: () => void;
}

type AudioPlayerContextType = AudioPlayerState & AudioPlayerActions;

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [allSongs, setAllSongsState] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playedIndices = useRef<Set<number>>(new Set());
  const seekRef = useRef<number | null>(null);

  const queue = useMemo(
    () => allSongs.filter((s) => s.video_links && s.video_links.length > 0),
    [allSongs]
  );

  const setAllSongs = useCallback((songs: Song[]) => {
    setAllSongsState(songs);
  }, []);

  const getRandomIndex = useCallback(
    (exclude?: number) => {
      const available = queue
        .map((_, i) => i)
        .filter((i) => !playedIndices.current.has(i) && i !== exclude);
      if (available.length === 0) {
        playedIndices.current.clear();
        const all = queue.map((_, i) => i).filter((i) => i !== exclude);
        return all[Math.floor(Math.random() * all.length)];
      }
      return available[Math.floor(Math.random() * available.length)];
    },
    [queue]
  );

  const playSong = useCallback(
    (song: Song) => {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      const idx = queue.findIndex((s) => s.id === song.id);
      if (idx >= 0) playedIndices.current.add(idx);
    },
    [queue]
  );

  const playAll = useCallback(() => {
    if (queue.length === 0) return;
    playedIndices.current.clear();
    if (isShuffleEnabled) {
      const idx = Math.floor(Math.random() * queue.length);
      playSong(queue[idx]);
    } else {
      playSong(queue[0]);
    }
  }, [queue, isShuffleEnabled, playSong]);

  const togglePlay = useCallback(() => {
    if (!currentSong && queue.length > 0) {
      playAll();
      return;
    }
    setIsPlaying((p) => !p);
  }, [currentSong, queue, playAll]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    const currentIdx = queue.findIndex((s) => s.id === currentSong?.id);
    if (isShuffleEnabled) {
      const idx = getRandomIndex(currentIdx);
      if (idx !== undefined) playSong(queue[idx]);
    } else {
      const nextIdx = (currentIdx + 1) % queue.length;
      playSong(queue[nextIdx]);
    }
  }, [queue, currentSong, isShuffleEnabled, getRandomIndex, playSong]);

  const previous = useCallback(() => {
    if (queue.length === 0) return;
    const currentIdx = queue.findIndex((s) => s.id === currentSong?.id);
    const prevIdx = currentIdx <= 0 ? queue.length - 1 : currentIdx - 1;
    playSong(queue[prevIdx]);
  }, [queue, currentSong, playSong]);

  const toggleShuffle = useCallback(() => {
    setIsShuffleEnabled((s) => !s);
    playedIndices.current.clear();
  }, []);

  const seekTo = useCallback((time: number) => {
    seekRef.current = time;
    setCurrentTime(time);
  }, []);

  const onTimeUpdate = useCallback((current: number, total: number) => {
    setCurrentTime(current);
    setDuration(total);
  }, []);

  const onVideoEnded = useCallback(() => {
    next();
  }, [next]);

  const value = useMemo(
    () => ({
      currentSong,
      isPlaying,
      isShuffleEnabled,
      queue,
      currentTime,
      duration,
      playSong,
      playAll,
      togglePlay,
      next,
      previous,
      toggleShuffle,
      seekTo,
      setAllSongs,
      onTimeUpdate,
      onVideoEnded,
    }),
    [
      currentSong,
      isPlaying,
      isShuffleEnabled,
      queue,
      currentTime,
      duration,
      playSong,
      playAll,
      togglePlay,
      next,
      previous,
      toggleShuffle,
      seekTo,
      setAllSongs,
      onTimeUpdate,
      onVideoEnded,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

export function useSeekRef() {
  return useRef<number | null>(null);
}

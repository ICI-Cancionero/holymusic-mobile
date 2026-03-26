import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchSongs } from "./api";
import { Song, SongGroup } from "./types";

export function useSongs(subdomain: string | undefined) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSongs = useCallback(async () => {
    if (!subdomain) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSongs(subdomain);
      setSongs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load songs");
    } finally {
      setIsLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const groups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = query
      ? songs.filter(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            (s.content && s.content.toLowerCase().includes(query))
        )
      : songs;

    const map = new Map<string, Song[]>();
    for (const song of filtered) {
      const letter = song.title.charAt(0).toUpperCase();
      const group = map.get(letter);
      if (group) {
        group.push(song);
      } else {
        map.set(letter, [song]);
      }
    }

    const result: SongGroup[] = [];
    for (const [letter, data] of Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    )) {
      result.push({ letter, count: data.length, data });
    }
    return result;
  }, [songs, searchQuery]);

  return { groups, isLoading, error, searchQuery, setSearchQuery, retry: loadSongs };
}

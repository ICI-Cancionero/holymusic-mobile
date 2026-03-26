import { Song } from "./types";

export async function fetchSongs(subdomain: string): Promise<Song[]> {
  const response = await fetch(
    `https://${subdomain}.holymusic.co/api/v1/songs`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch songs: ${response.status}`);
  }
  return response.json();
}

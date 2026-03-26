export interface VideoLink {
  id: number;
  provider: string;
  video_id: string;
  url: string;
}

export interface Song {
  id: number;
  title: string;
  content: string;
  position: number;
  video_links: VideoLink[];
  created_at: string;
  updated_at: string;
}

export interface SongGroup {
  letter: string;
  count: number;
  data: Song[];
}

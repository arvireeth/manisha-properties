
import { useState, useEffect, useCallback, useRef } from 'react';
import type { YouTubeVideo, YouTubeSnippet } from '../types/youtube';

const API_KEY =
  import.meta.env.VITE_YOUTUBE_API_KEY_PREVIEW ||
  import.meta.env.VITE_YOUTUBE_API_KEY;

export const YOUTUBE_PLAYLISTS = {
  sale: 'PLYjkaPSA54tY',
  rental: 'PLYo9ildZkhfo',
  purchased: 'PLJocVtGV0psw',
  occupied: 'PLdmLuIEZE-sQ',
} as const;

export type YouTubePlaylistId =
  (typeof YOUTUBE_PLAYLISTS)[keyof typeof YOUTUBE_PLAYLISTS];

interface YouTubePlaylistItem {
  snippet?: {
    resourceId?: {
      videoId?: string;
    };
  } & Partial<YouTubeSnippet>;
}

interface YouTubePlaylistResponse {
  error?: {
    message?: string;
  };
  items?: YouTubePlaylistItem[];
  nextPageToken?: string;
}

const PLAYLIST_CACHE_MS = 5 * 60 * 1000;

function readPlaylistCache(key: string): YouTubePlaylistResponse | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { savedAt: number; result: YouTubePlaylistResponse };
    return Date.now() - entry.savedAt < PLAYLIST_CACHE_MS && Array.isArray(entry.result.items) ? entry.result : null;
  } catch {
    return null;
  }
}

export function useYouTube(
  playlistId: YouTubePlaylistId = YOUTUBE_PLAYLISTS.sale
) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [hasMore, setHasMore] = useState(false);

  const requestId = useRef(0);

  const fetchVideos = useCallback(
    async (pageToken?: string, force = false) => {
      const currentRequestId = ++requestId.current;

      try {
        setLoading(true);
        setError(null);

        if (!API_KEY) {
          throw new Error('Missing YouTube API Key');
        }

        const params = new URLSearchParams({
          part: 'snippet',
          playlistId,
          maxResults: '24',
        });

        if (pageToken) {
          params.append('pageToken', pageToken);
        }

        const cacheKey = `mp-playlist-v1:${playlistId}:${pageToken ?? ''}`;
        let data = force ? null : readPlaylistCache(cacheKey);
        if (!data) {
          params.set('key', API_KEY);
          const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`);
          if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
          data = await response.json() as YouTubePlaylistResponse;
          if (Array.isArray(data.items)) {
            try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), result: data })); }
            catch { /* Playlist remains usable without browser storage. */ }
          }
        }

        if (data.error) {
          throw new Error(data.error.message || 'YouTube API Error');
        }

        const items: YouTubeVideo[] = (data.items || [])
          .filter(
            (
              item
            ): item is YouTubePlaylistItem & {
              snippet: NonNullable<YouTubePlaylistItem['snippet']> & {
                resourceId: { videoId: string };
              };
            } => {
              const snippet = item.snippet;
              const title = snippet?.title?.trim().toLowerCase();

              return Boolean(
                snippet?.resourceId?.videoId &&
                title !== 'deleted video' &&
                title !== 'private video'
              );
            }
          )
          .map((item) => ({
            id: {
              videoId: item.snippet.resourceId.videoId,
            },
            snippet: item.snippet as YouTubeSnippet,
          }));

        if (currentRequestId !== requestId.current) return;

        setVideos((previous) =>
          pageToken ? [...previous, ...items] : items
        );

        setNextPageToken(data.nextPageToken);
        setHasMore(Boolean(data.nextPageToken));
      } catch (err) {
        if (currentRequestId !== requestId.current) return;

        setError(
          err instanceof Error ? err.message : 'Failed to load videos'
        );
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    },
    [playlistId]
  );

  useEffect(() => {
    setVideos([]);
    setNextPageToken(undefined);
    setHasMore(false);
    setLoading(true);
    setError(null);

    fetchVideos();

    return () => {
      requestId.current += 1;
    };
  }, [fetchVideos]);
  useEffect(() => {
    const onVisible = () => {
      if (document.hidden || !navigator.onLine) return;
      const key = `mp-playlist-v1:${playlistId}:`;
      if (!readPlaylistCache(key)) fetchVideos();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, [fetchVideos, playlistId]);
  const refresh = useCallback(() => {
    setNextPageToken(undefined);
    setHasMore(false);
    fetchVideos(undefined, true);
}, [fetchVideos]);
  const loadMore = useCallback(() => {
    if (nextPageToken && !loading) {
      fetchVideos(nextPageToken);
    }
  }, [nextPageToken, loading, fetchVideos]);

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
 };
}

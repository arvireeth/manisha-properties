
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
    async (pageToken?: string) => {
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
          key: API_KEY,
        });

        if (pageToken) {
          params.append('pageToken', pageToken);
        }

        const response = await fetch(
         `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
        {
          cache: 'no-store',
        }
       );

        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }

        const data: YouTubePlaylistResponse = await response.json();

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
  const refresh = useCallback(() => {
    setNextPageToken(undefined);
    setHasMore(false);
    fetchVideos();
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

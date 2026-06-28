import { useState, useEffect, useCallback } from 'react';
import type { YouTubeVideo } from '../types/youtube';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCcIBFWyXF4YgSubKfLiallw';

export function useYouTube() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);

  const fetchVideos = useCallback(async (pageToken?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        part: 'snippet',
        channelId: CHANNEL_ID,
        maxResults: '24',
        order: 'date',
        type: 'video',
        key: API_KEY,
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`YouTube API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }

      const items: YouTubeVideo[] = (data.items || []).filter(
        (item: YouTubeVideo) => item.id?.videoId
      );

      setVideos(prev => (pageToken ? [...prev, ...items] : items));
      setNextPageToken(data.nextPageToken);
      setHasMore(Boolean(data.nextPageToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const loadMore = useCallback(() => {
    if (nextPageToken && !loading) {
      fetchVideos(nextPageToken);
    }
  }, [nextPageToken, loading, fetchVideos]);

  return { videos, loading, error, hasMore, loadMore };
}

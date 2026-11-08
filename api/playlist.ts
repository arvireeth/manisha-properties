const playlists = new Set(['PLYjkaPSA54tY', 'PLYo9ildZkhfo', 'PLJocVtGV0psw', 'PLdmLuIEZE-sQ']);

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get('playlistId') ?? '';
  const pageToken = url.searchParams.get('pageToken') ?? '';
  if (!playlists.has(playlistId) || pageToken.length > 200 || !/^[A-Za-z0-9_-]*$/.test(pageToken)) {
    return new Response('Invalid playlist request', { status: 400 });
  }
  const key = process.env.VITE_YOUTUBE_API_KEY_PREVIEW || process.env.VITE_YOUTUBE_API_KEY;
  if (!key) return new Response('Playlist service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });

  const params = new URLSearchParams({ part: 'snippet', playlistId, maxResults: '24', key });
  if (pageToken) params.set('pageToken', pageToken);
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return new Response('Playlist service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    const data = await response.json() as { items?: unknown[]; nextPageToken?: string };
    if (!Array.isArray(data.items)) return new Response('Playlist service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ items: data.items, nextPageToken: data.nextPageToken }, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300' },
    });
  } catch {
    return new Response('Playlist service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

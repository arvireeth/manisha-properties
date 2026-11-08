const upstream = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180 ||
      !url.searchParams.has('lat') || !url.searchParams.has('lon')) {
    return new Response('Invalid coordinates', { status: 400 });
  }

  // Normalize nearby devices to one CDN cache entry. This also avoids sending
  // precise coordinates to the weather provider for a neighborhood forecast.
  const place = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const weatherUrl = `${upstream}${encodeURIComponent(place)}?unitGroup=metric&include=current&contentType=json`;
  try {
    const result = await fetch(weatherUrl, { signal: AbortSignal.timeout(8000) });
    if (!result.ok) return new Response('Weather temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    const data = await result.json() as { currentConditions?: unknown };
    if (!data.currentConditions) return new Response('Weather temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ currentConditions: data.currentConditions }, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=600' },
    });
  } catch {
    return new Response('Weather temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

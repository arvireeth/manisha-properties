const upstream = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const fallback = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

async function forecast(latitude: number, longitude: number): Promise<Response> {
  const url = `${fallback}?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}`;
  const result = await fetch(url, {
    headers: { 'User-Agent': 'ManishaPropertiesWeather/1.0 https://manishaproperties.in/privacy manishaguptaproperties@gmail.com' },
    signal: AbortSignal.timeout(8000),
  });
  if (!result.ok) throw new Error('Forecast unavailable');
  const data = await result.json() as { properties?: { timeseries?: Array<{ data?: { instant?: { details?: Record<string, number> }; next_1_hours?: { summary?: { symbol_code?: string } } } }> } };
  const reading = data.properties?.timeseries?.[0]?.data;
  const details = reading?.instant?.details;
  const symbol = reading?.next_1_hours?.summary?.symbol_code;
  if (!details || !symbol || !Number.isFinite(details.air_temperature) || !Number.isFinite(details.relative_humidity) || !Number.isFinite(details.wind_speed)) throw new Error('Invalid forecast');
  const icon = symbol.replace(/_/g, '-');
  const conditions = symbol.replace(/_(day|night|polartwilight)$/, '').replace(/_/g, ' ');
  // Outside the Nordic region the upstream forecast must be reused for at
  // least three hours. Honor a longer Expires value when one is supplied.
  const expiresAt = Date.parse(result.headers.get('expires') ?? '');
  const ttl = Math.max(10800, Number.isFinite(expiresAt) ? Math.ceil((expiresAt - Date.now()) / 1000) : 0);
  return Response.json({ currentConditions: {
    temp: details.air_temperature,
    humidity: details.relative_humidity,
    windspeed: details.wind_speed * 3.6,
    conditions,
    icon,
    source: 'forecast',
  } }, { headers: { 'Cache-Control': `public, max-age=0, s-maxage=${ttl}` } });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));
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
    if (!result.ok) throw new Error('Current conditions unavailable');
    const data = await result.json() as { currentConditions?: unknown };
    if (!data.currentConditions) throw new Error('Current conditions unavailable');
    return Response.json({ currentConditions: data.currentConditions }, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=600' },
    });
  } catch {
    try { return await forecast(lat, lon); }
    catch { return new Response('Weather temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
  }
}

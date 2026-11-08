const upstream = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const unavailable = () => new Response('Weather temporarily unavailable', {
  status: 503,
  headers: { 'Cache-Control': 'no-store' },
});

type ForecastEntry = {
  time: string;
  data?: {
    instant?: { details?: Record<string, number> };
    next_1_hours?: { summary?: { symbol_code?: string } };
  };
};

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));
  if (!url.searchParams.has('lat') || !url.searchParams.has('lon') ||
      !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return new Response('Invalid coordinates', { status: 400 });
  }

  // One weather lookup per approximate area, rather than per precise device.
  const weatherUrl = `${upstream}?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}`;
  try {
    const result = await fetch(weatherUrl, {
      headers: { 'User-Agent': 'ManishaPropertiesWeather/1.0 https://manishaproperties.in/privacy manishaguptaproperties@gmail.com' },
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) return unavailable();
    const data = await result.json() as { properties?: { timeseries?: ForecastEntry[] } };
    // Keep upcoming hourly samples so a three-hour cache hit still shows the
    // forecast for the current hour instead of a frozen condition.
    const forecast = data.properties?.timeseries?.slice(0, 12).map(({ time, data: reading }) => {
      const details = reading?.instant?.details;
      const symbol = reading?.next_1_hours?.summary?.symbol_code;
      if (!details || !symbol || !Number.isFinite(details.air_temperature) ||
          !Number.isFinite(details.relative_humidity) || !Number.isFinite(details.wind_speed)) return null;
      return {
        time,
        temp: details.air_temperature,
        humidity: details.relative_humidity,
        windspeed: details.wind_speed * 3.6,
        conditions: symbol.replace(/_(day|night|polartwilight)$/, '').replace(/_/g, ' '),
        icon: symbol.replace(/_/g, '-'),
      };
    }).filter((entry) => entry !== null);
    if (!forecast?.length) return unavailable();

    // For India, identical MET Norway requests must be at least three hours
    // apart. A longer Expires header takes precedence.
    const expiresAt = Date.parse(result.headers.get('expires') ?? '');
    const ttl = Math.max(10800, Number.isFinite(expiresAt) ? Math.ceil((expiresAt - Date.now()) / 1000) : 0);
    return Response.json({ forecast }, {
      headers: { 'Cache-Control': `public, max-age=0, s-maxage=${ttl}` },
    });
  } catch {
    return unavailable();
  }
}

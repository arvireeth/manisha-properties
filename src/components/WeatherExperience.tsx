import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, Moon, Sun, Wind } from 'lucide-react';

type WeatherNow = {
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  conditions: string;
  icon: string;
  datetimeEpoch?: number;
  source?: 'forecast';
};

type WeatherResponse = { currentConditions?: WeatherNow };
type WeatherContextValue = { businessWeather: WeatherNow | null; displayedWeather: WeatherNow | null; visitorWeather: WeatherNow | null; visitorArea: string | null; weatherUnavailable: boolean; locationStatus: 'checking' | 'available' | 'denied' | 'unavailable'; requestVisitorWeather: () => void };

const WeatherContext = createContext<WeatherContextValue | null>(null);
const BUSINESS_COORDS = { latitude: 28.6601, longitude: 77.1534 };
const CACHE_MS = 10 * 60 * 1000;
const POSITION_MAX_AGE_MS = 5 * 60 * 1000;

async function lookupVisitorArea(latitude: number, longitude: number): Promise<string | null> {
  // This free endpoint must be called in the visitor's browser using coordinates
  // freshly obtained from that same device, never from a server or stored data.
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('localityLanguage', 'en');
  const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!response.ok) return null;
  const result = await response.json() as { locality?: string; city?: string; lookupSource?: string; latitude?: number; longitude?: number };
  if (/ip/i.test(result.lookupSource ?? '')) return null;
  if (typeof result.latitude === 'number' && Math.abs(result.latitude - latitude) > 0.05) return null;
  if (typeof result.longitude === 'number' && Math.abs(result.longitude - longitude) > 0.05) return null;
  const area = result.locality?.trim() || result.city?.trim();
  return area && area.length <= 80 ? area : null;
}

function readCache(key: string): WeatherNow | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as { savedAt: number; data: WeatherNow };
    return parsed.savedAt <= Date.now() && Date.now() - parsed.savedAt < CACHE_MS ? parsed.data : null;
  } catch {
    return null;
  }
}

async function loadWeather(latitude: number, longitude: number, cacheKey: string): Promise<WeatherNow> {
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const url = `/api/weather?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
  const result = (await response.json()) as WeatherResponse;
  if (!result.currentConditions) throw new Error('Current weather is unavailable');

  const data = result.currentConditions;
  if (!Number.isFinite(data.temp) || !data.icon || !data.conditions) throw new Error('Invalid current weather');
  if (data.datetimeEpoch && Math.abs(Date.now() / 1000 - data.datetimeEpoch) > 2 * 60 * 60) {
    throw new Error('Weather reading is too old');
  }
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Weather remains usable when browser storage is unavailable.
  }
  return data;
}

function weatherKind(icon: string): string {
  // The provider icon represents the current condition. The descriptive text
  // can mention passing showers even when the current icon is clear/cloudy.
  const value = icon.toLowerCase();
  if (value.includes('thunder')) return 'storm';
  if (value.includes('snow') || value.includes('sleet') || value.includes('ice') || value.includes('hail')) return 'snow';
  if (value.includes('rain') || value.includes('shower') || value.includes('drizzle')) return 'rain';
  if (value.includes('fog') || value.includes('mist') || value.includes('haze')) return 'fog';
  if (value.includes('wind')) return 'windy';
  if (value.includes('cloud')) return 'cloud';
  if (value.includes('clear-night') || value.includes('night')) return 'night';
  return 'sun';
}

function WeatherIcon({ kind, size = 22 }: { kind: string; size?: number }) {
  const props = { size, strokeWidth: 1.7, 'aria-hidden': true as const };
  if (kind === 'storm') return <CloudLightning {...props} />;
  if (kind === 'snow') return <CloudSnow {...props} />;
  if (kind === 'rain') return <CloudRain {...props} />;
  if (kind === 'fog') return <CloudFog {...props} />;
  if (kind === 'cloud') return <CloudSun {...props} />;
  if (kind === 'windy') return <Wind {...props} />;
  if (kind === 'night') return <Moon {...props} />;
  return <Sun {...props} />;
}

function AnimatedTemperature({ value, unit }: { value: number; unit: 'C' | 'F' }) {
  const converted = unit === 'F' ? (value * 9) / 5 + 32 : value;
  const target = Math.round(converted);
  const [displayed, setDisplayed] = useState(target);
  const currentValue = useRef(target);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentValue.current = target;
      setDisplayed(target);
      return;
    }

    const startValue = currentValue.current;
    if (startValue === target) return;
    let frame = 0;
    let startTime = 0;
    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / 850, 1);
      const next = Math.round(startValue + (target - startValue) * (1 - Math.pow(1 - progress, 3)));
      currentValue.current = next;
      setDisplayed(next);
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return <span className="weather-temperature gold-text" aria-label={`${target} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}`}>{displayed}°{unit}</span>;
}

function WeatherLayer({ kind }: { kind: string }) {
  if (kind === 'sun' || kind === 'night') {
    return <div className={`weather-layer weather-${kind}`} aria-hidden="true"><span /><span /><span /></div>;
  }
  if (kind === 'cloud') {
    return <div className="weather-layer weather-cloud" aria-hidden="true"><span /><span /><span /></div>;
  }
  if (kind === 'fog' || kind === 'windy') {
    return <div className={`weather-layer weather-${kind}`} aria-hidden="true"><span /><span /><span /><span /></div>;
  }
  const drops = Array.from({ length: kind === 'storm' ? 18 : kind === 'snow' ? 16 : 14 }, (_, index) => index);
  return (
    <div className={`weather-layer weather-${kind}`} aria-hidden="true">
      {drops.map((drop) => (
        <i key={drop} style={{ left: `${(drop * 37) % 100}%`, animationDelay: `${(drop % 13) * -0.37}s`, animationDuration: `${kind === 'snow' ? 5 + (drop % 7) * 1.4 : 0.72 + (drop % 6) * 0.19}s`, opacity: 0.35 + (drop % 5) * 0.12, ...(kind === 'snow' ? { width: `${3 + (drop % 4)}px`, height: `${3 + (drop % 4)}px` } : {}) }} />
      ))}
      {kind === 'snow' && <span className="snow-glow" />}
    </div>
  );
}

export function WeatherExperience({ children }: { children: ReactNode }) {
  const [visitorWeather, setVisitorWeather] = useState<WeatherNow | null>(null);
  const [visitorArea, setVisitorArea] = useState<string | null>(null);
  const [businessWeather, setBusinessWeather] = useState<WeatherNow | null>(null);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'available' | 'denied' | 'unavailable'>('checking');
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const visitorCoordinates = useRef<{ latitude: number; longitude: number } | null>(null);
  const locationRequest = useRef(0);

  useEffect(() => {
    let active = true;
    const refreshBusinessWeather = () => {
      loadWeather(BUSINESS_COORDS.latitude, BUSINESS_COORDS.longitude, 'mp-weather-business-v2')
        .then((data) => { if (active) { setBusinessWeather(data); setWeatherUnavailable(false); } })
        .catch(() => { if (active) { setBusinessWeather(null); setWeatherUnavailable(true); } });
    };
    refreshBusinessWeather();

    const loadVisitorWeather = (latitude: number, longitude: number) => {
      const request = ++locationRequest.current;
      visitorCoordinates.current = { latitude, longitude };
      if (active) { setLocationStatus('available'); setVisitorArea(null); setVisitorWeather(null); }
      lookupVisitorArea(latitude, longitude)
        .then((area) => { if (active && request === locationRequest.current) setVisitorArea(area); })
        .catch(() => { if (active && request === locationRequest.current) setVisitorArea(null); });
      const cacheKey = 'mp-weather-visitor-v2-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
      loadWeather(latitude, longitude, cacheKey)
        .then((data) => { if (active && request === locationRequest.current) setVisitorWeather(data); })
        .catch(() => { if (active && request === locationRequest.current) setVisitorWeather(null); });
    };

    // Request the browser's location permission on each fresh opening. Browsers
    // reuse a lasting grant automatically; denied requests leave office weather
    // as the fallback. Clear the old session coordinate copy; weather cache
    // entries still use an approximate-location key for ten-minute reuse.
    try { sessionStorage.removeItem('mp-location-coordinates'); } catch { /* Storage may be unavailable. */ }
    if (!('geolocation' in navigator)) setLocationStatus('unavailable');
    else navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) return;
        loadVisitorWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (active) setLocationStatus(error.code === 1 ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: POSITION_MAX_AGE_MS }
    );

    const refresh = () => {
      if (document.hidden) return;
      refreshBusinessWeather();
      if (visitorCoordinates.current) {
        const { latitude, longitude } = visitorCoordinates.current;
        const cacheKey = 'mp-weather-visitor-v2-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
        loadWeather(latitude, longitude, cacheKey)
          .then((data) => { if (active) setVisitorWeather(data); })
          .catch(() => { if (active) setVisitorWeather(null); });
      }
    };
    const refreshTimer = window.setInterval(refresh, CACHE_MS);
    const onVisibility = () => {
      setPageVisible(!document.hidden);
      if (!document.hidden) refresh();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => { active = false; window.clearInterval(refreshTimer); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  const requestVisitorWeather = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unavailable');
      return;
    }
    setLocationStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const request = ++locationRequest.current;
        visitorCoordinates.current = { latitude, longitude };
        setVisitorArea(null);
        setVisitorWeather(null);
        lookupVisitorArea(latitude, longitude)
          .then((area) => { if (request === locationRequest.current) setVisitorArea(area); })
          .catch(() => { if (request === locationRequest.current) setVisitorArea(null); });
        const cacheKey = 'mp-weather-visitor-v2-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
        loadWeather(latitude, longitude, cacheKey)
          .then((data) => { if (request === locationRequest.current) { setVisitorWeather(data); setLocationStatus('available'); } })
          .catch(() => { if (request === locationRequest.current) { setVisitorWeather(null); setLocationStatus('unavailable'); } });
      },
      (error) => {
        ++locationRequest.current;
        visitorCoordinates.current = null;
        setVisitorArea(null);
        setVisitorWeather(null);
        setLocationStatus(error.code === 1 ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: POSITION_MAX_AGE_MS }
    );
  };

  const displayedWeather = visitorWeather ?? businessWeather;
  const kind = useMemo(
    () => displayedWeather ? weatherKind(displayedWeather.icon) : 'sun',
    [displayedWeather]
  );
  return (
    <WeatherContext.Provider value={{ businessWeather, displayedWeather, visitorWeather, visitorArea, weatherUnavailable, locationStatus, requestVisitorWeather }}>
      {children}
      {displayedWeather && pageVisible && <WeatherLayer kind={kind} />}
    </WeatherContext.Provider>
  );
}

export function WeatherWidget() {
  const weather = useContext(WeatherContext);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  if (!weather) return null;
  const { businessWeather, visitorWeather, visitorArea, weatherUnavailable, locationStatus, requestVisitorWeather } = weather;
  const businessKind = businessWeather ? weatherKind(businessWeather.icon) : 'sun';
  const animationWeather = visitorWeather ?? businessWeather;
  const animationKind = animationWeather ? weatherKind(animationWeather.icon) : null;
  const visitorKind = visitorWeather ? weatherKind(visitorWeather.icon) : null;
  const conditionLabel: Record<string, string> = {
    storm: 'Thunderstorm', snow: 'Snow', rain: 'Rain', fog: 'Fog',
    windy: 'Wind', cloud: 'Cloudy', night: 'Clear night', sun: 'Clear skies',
  };

  return (
    <aside className="weather-widget glass-card" aria-label="Weather near Manisha Properties office and your shared location">
      <div className="flex items-center gap-3">
        <div className="weather-icon text-[#D4AF37]"><WeatherIcon kind={businessKind} size={28} /></div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,232,0.55)]">Office weather · Moti Nagar</div>
          {businessWeather ? (
            <div className="flex items-baseline gap-2">
              <AnimatedTemperature value={businessWeather.temp} unit={temperatureUnit} />
              <button type="button" onClick={() => setTemperatureUnit((unit) => unit === 'C' ? 'F' : 'C')} aria-label={`°${temperatureUnit === 'C' ? 'F' : 'C'} — Switch to degrees ${temperatureUnit === 'C' ? 'Fahrenheit' : 'Celsius'}`} className="rounded border border-[rgba(212,175,55,0.28)] px-1.5 py-0.5 text-[10px] font-semibold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]">°{temperatureUnit === 'C' ? 'F' : 'C'}</button>
              <span className="weather-condition-glow">{conditionLabel[businessKind]}</span>
            </div>
          ) : (
            <div className="text-sm text-[rgba(248,244,232,0.65)]">{weatherUnavailable ? 'Weather temporarily unavailable' : 'Checking current weather…'}</div>
          )}
        </div>
      </div>
      {businessWeather && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[rgba(248,244,232,0.58)]">
          {Number.isFinite(businessWeather.feelslike) && <span className="inline-flex items-center gap-1"><CloudDrizzle size={12} /> Feels {Math.round(temperatureUnit === 'F' ? (businessWeather.feelslike * 9) / 5 + 32 : businessWeather.feelslike)}°{temperatureUnit}</span>}
          <span className="inline-flex items-center gap-1"><Droplets size={12} /> {Math.round(businessWeather.humidity)}% humidity</span>
          <span className="inline-flex items-center gap-1"><Wind size={12} /> {Math.round(businessWeather.windspeed)} km/h</span>
        </div>
      )}
      <div className="weather-area-row">
        <div className="weather-icon text-[#D4AF37]"><WeatherIcon kind={visitorKind ?? 'sun'} size={22} /></div>
        <div className="min-w-0">
          <div className="weather-area-label">Your area{visitorWeather && visitorArea ? ` · ${visitorArea}` : ''}</div>
          {visitorWeather && visitorKind ? (
            <div className="weather-area-reading">
              <span className="weather-condition-glow">{conditionLabel[visitorKind]}</span>
              <span>{Math.round(temperatureUnit === 'F' ? (visitorWeather.temp * 9) / 5 + 32 : visitorWeather.temp)}°{temperatureUnit}</span>
            </div>
          ) : (
            <div className="text-xs text-[rgba(248,244,232,0.6)]">
              {locationStatus === 'checking' ? 'Checking your location…' : locationStatus === 'denied' ? 'Location access is off' : 'Share location to see local weather'}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[rgba(248,244,232,0.58)]">
        {animationKind && <span>Animation follows {visitorWeather ? 'your area' : 'the office'}.</span>}
        {(businessWeather?.source === 'forecast' || visitorWeather?.source === 'forecast') && <span>Forecast estimate; conditions may differ locally.</span>}
        {!visitorWeather && locationStatus !== 'checking' && (
          <button type="button" onClick={requestVisitorWeather} className="underline underline-offset-2 text-[#D4AF37] hover:text-[#FFD700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]">
            {locationStatus === 'denied' ? 'Enable location in browser settings' : 'Use my local weather'}
          </button>
        )}
      </div>
    </aside>
  );
}

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
};

type WeatherResponse = { currentConditions?: WeatherNow };
type WeatherContextValue = { businessWeather: WeatherNow | null; displayedWeather: WeatherNow | null; visitorWeather: WeatherNow | null; weatherUnavailable: boolean; locationStatus: 'checking' | 'available' | 'denied' | 'unavailable'; requestVisitorWeather: () => void };

const WeatherContext = createContext<WeatherContextValue | null>(null);
const BUSINESS_COORDS = { latitude: 28.6601, longitude: 77.1534 };
const CACHE_MS = 10 * 60 * 1000;
const COORDINATES_MS = 30 * 60 * 1000;

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

  const place = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(place)}?unitGroup=metric&include=current&contentType=json`;
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
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
  const [businessWeather, setBusinessWeather] = useState<WeatherNow | null>(null);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'available' | 'denied' | 'unavailable'>('checking');
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const visitorCoordinates = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let active = true;
    const refreshBusinessWeather = () => {
      loadWeather(BUSINESS_COORDS.latitude, BUSINESS_COORDS.longitude, 'mp-weather-business-v2')
        .then((data) => { if (active) { setBusinessWeather(data); setWeatherUnavailable(false); } })
        .catch(() => { if (active) { setBusinessWeather(null); setWeatherUnavailable(true); } });
    };
    refreshBusinessWeather();

    const loadVisitorWeather = (latitude: number, longitude: number) => {
      visitorCoordinates.current = { latitude, longitude };
      if (active) setLocationStatus('available');
      const cacheKey = 'mp-weather-visitor-v2-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
      loadWeather(latitude, longitude, cacheKey)
        .then((data) => { if (active) setVisitorWeather(data); })
        .catch(() => { if (active) setVisitorWeather(null); });
    };

    let savedCoordinates: { latitude: number; longitude: number } | null = null;
    try {
      const saved = sessionStorage.getItem('mp-location-coordinates');
      if (saved) {
        const parsed = JSON.parse(saved) as { latitude: number; longitude: number; savedAt?: number };
        if (Number.isFinite(parsed.latitude) && Number.isFinite(parsed.longitude) && parsed.savedAt && Date.now() - parsed.savedAt < COORDINATES_MS) savedCoordinates = parsed;
      }
    } catch { /* Continue with office weather. */ }

    if (savedCoordinates) {
      loadVisitorWeather(savedCoordinates.latitude, savedCoordinates.longitude);
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!active) return;
            const { latitude, longitude } = position.coords;
            try { sessionStorage.setItem('mp-location-coordinates', JSON.stringify({ latitude, longitude, savedAt: Date.now() })); } catch { /* Session-only cache is optional. */ }
            loadVisitorWeather(latitude, longitude);
          },
          () => { if (active) { setVisitorWeather(null); setLocationStatus('denied'); } },
          { enableHighAccuracy: false, timeout: 7000, maximumAge: 30 * 60 * 1000 }
        );
      } else {
        setLocationStatus('unavailable');
      }
    }

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
        try { sessionStorage.setItem('mp-location-coordinates', JSON.stringify({ latitude, longitude, savedAt: Date.now() })); } catch { /* Optional session cache. */ }
        visitorCoordinates.current = { latitude, longitude };
        const cacheKey = 'mp-weather-visitor-v2-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
        loadWeather(latitude, longitude, cacheKey)
          .then((data) => { setVisitorWeather(data); setLocationStatus('available'); })
          .catch(() => { setVisitorWeather(null); setLocationStatus('unavailable'); });
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 30 * 60 * 1000 }
    );
  };

  const displayedWeather = visitorWeather ?? businessWeather;
  const kind = useMemo(
    () => displayedWeather ? weatherKind(displayedWeather.icon) : 'sun',
    [displayedWeather]
  );
  return (
    <WeatherContext.Provider value={{ businessWeather, displayedWeather, visitorWeather, weatherUnavailable, locationStatus, requestVisitorWeather }}>
      {children}
      {displayedWeather && pageVisible && <WeatherLayer kind={kind} />}
    </WeatherContext.Provider>
  );
}

export function WeatherWidget() {
  const weather = useContext(WeatherContext);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  if (!weather) return null;
  const { businessWeather, visitorWeather, weatherUnavailable, locationStatus, requestVisitorWeather } = weather;
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
          <span className="inline-flex items-center gap-1"><CloudDrizzle size={12} /> Feels {Math.round(temperatureUnit === 'F' ? (businessWeather.feelslike * 9) / 5 + 32 : businessWeather.feelslike)}°{temperatureUnit}</span>
          <span className="inline-flex items-center gap-1"><Droplets size={12} /> {Math.round(businessWeather.humidity)}% humidity</span>
          <span className="inline-flex items-center gap-1"><Wind size={12} /> {Math.round(businessWeather.windspeed)} km/h</span>
        </div>
      )}
      <div className="weather-area-row">
        <div className="weather-icon text-[#D4AF37]"><WeatherIcon kind={visitorKind ?? 'sun'} size={22} /></div>
        <div className="min-w-0">
          <div className="weather-area-label">Your area · shared location</div>
          {visitorWeather && visitorKind ? (
            <div className="weather-area-reading">
              <span className="weather-condition-glow">{conditionLabel[visitorKind]}</span>
              <span>{Math.round(temperatureUnit === 'F' ? (visitorWeather.temp * 9) / 5 + 32 : visitorWeather.temp)}°{temperatureUnit}</span>
            </div>
          ) : (
            <div className="text-xs text-[rgba(248,244,232,0.6)]">
              {locationStatus === 'checking' ? 'Checking your location…' : 'Local weather unavailable'}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[rgba(248,244,232,0.58)]">
        {animationKind && <span>Animation follows {visitorWeather ? 'your area' : 'the office'}.</span>}
        {!visitorWeather && locationStatus !== 'checking' && (
          <button type="button" onClick={requestVisitorWeather} className="underline underline-offset-2 text-[#D4AF37] hover:text-[#FFD700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]">
            {locationStatus === 'denied' ? 'Enable location in browser settings' : 'Use my local weather'}
          </button>
        )}
        <a href="https://www.visualcrossing.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#D4AF37]">Weather by Visual Crossing</a>
      </div>
    </aside>
  );
}

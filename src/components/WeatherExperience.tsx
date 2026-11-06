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
};

type WeatherResponse = { currentConditions?: WeatherNow };
type WeatherContextValue = { businessWeather: WeatherNow | null; displayedWeather: WeatherNow | null; visitorWeather: WeatherNow | null; weatherUnavailable: boolean };

const WeatherContext = createContext<WeatherContextValue | null>(null);
const BUSINESS_COORDS = { latitude: 28.6601, longitude: 77.1534 };
const CACHE_MS = 30 * 60 * 1000;

function readCache(key: string): WeatherNow | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as { savedAt: number; data: WeatherNow };
    return Date.now() - parsed.savedAt < CACHE_MS ? parsed.data : null;
  } catch {
    return null;
  }
}

async function loadWeather(latitude: number, longitude: number, cacheKey: string): Promise<WeatherNow> {
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const place = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(place)}/today?unitGroup=metric&include=current&contentType=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
  const result = (await response.json()) as WeatherResponse;
  if (!result.currentConditions) throw new Error('Current weather is unavailable');

  const data = result.currentConditions;
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Weather remains usable when browser storage is unavailable.
  }
  return data;
}

function weatherKind(icon: string, conditions: string): string {
  const value = `${icon} ${conditions}`.toLowerCase();
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

function AnimatedTemperature({ value }: { value: number }) {
  const target = Math.round(value);
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

  return <span className="weather-temperature gold-text" aria-label={`${target} degrees Celsius`}>{displayed}°C</span>;
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
  const drops = Array.from({ length: kind === 'storm' ? 48 : kind === 'snow' ? 42 : 38 }, (_, index) => index);
  const glassDrops = Array.from({ length: kind === 'storm' ? 12 : 9 }, (_, index) => index);
  return (
    <div className={`weather-layer weather-${kind}`} aria-hidden="true">
      {drops.map((drop) => (
        <i key={drop} style={{ left: `${(drop * 37) % 100}%`, animationDelay: `${(drop % 13) * -0.37}s`, animationDuration: `${kind === 'snow' ? 5 + (drop % 7) * 1.4 : 0.72 + (drop % 6) * 0.19}s`, opacity: 0.35 + (drop % 5) * 0.12, ...(kind === 'snow' ? { width: `${3 + (drop % 4)}px`, height: `${3 + (drop % 4)}px` } : {}) }} />
      ))}
      {(kind === 'rain' || kind === 'storm') && glassDrops.map((drop) => (
        <b key={`glass-${drop}`} style={{ left: `${(drop * 61 + 8) % 100}%`, top: `${(drop * 29 + 7) % 86 + 5}%`, animationDelay: `${drop * -1.7}s`, animationDuration: `${9 + (drop % 4) * 2}s` }} />
      ))}
      {kind === 'snow' && <span className="snow-glow" />}
    </div>
  );
}

export function WeatherExperience({ children }: { children: ReactNode }) {
  const [visitorWeather, setVisitorWeather] = useState<WeatherNow | null>(null);
  const [businessWeather, setBusinessWeather] = useState<WeatherNow | null>(null);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let visitorCoordinates: { latitude: number; longitude: number } | null = null;

    const refreshBusinessWeather = () => {
      loadWeather(BUSINESS_COORDS.latitude, BUSINESS_COORDS.longitude, 'mp-weather-business-v1')
        .then((data) => { if (active) { setBusinessWeather(data); setWeatherUnavailable(false); } })
        .catch(() => { if (active) setWeatherUnavailable(true); });
    };
    refreshBusinessWeather();

    const loadVisitorWeather = (latitude: number, longitude: number) => {
      visitorCoordinates = { latitude, longitude };
      const cacheKey = 'mp-weather-visitor-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
      loadWeather(latitude, longitude, cacheKey)
        .then((data) => { if (active) setVisitorWeather(data); })
        .catch(() => { if (active) setVisitorWeather(null); });
    };

    let locationAlreadyRequested = false;
    let savedCoordinates: { latitude: number; longitude: number } | null = null;
    try {
      locationAlreadyRequested = sessionStorage.getItem('mp-location-requested') === '1';
      const saved = sessionStorage.getItem('mp-location-coordinates');
      if (saved) {
        const parsed = JSON.parse(saved) as { latitude: number; longitude: number };
        if (Number.isFinite(parsed.latitude) && Number.isFinite(parsed.longitude)) savedCoordinates = parsed;
      }
    } catch { /* Continue with office weather. */ }

    if (savedCoordinates) {
      loadVisitorWeather(savedCoordinates.latitude, savedCoordinates.longitude);
    } else if (!locationAlreadyRequested) {
      try { sessionStorage.setItem('mp-location-requested', '1'); } catch { /* Do not block browsing. */ }
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!active) return;
            const { latitude, longitude } = position.coords;
            try { sessionStorage.setItem('mp-location-coordinates', JSON.stringify({ latitude, longitude })); } catch { /* Session-only cache is optional. */ }
            loadVisitorWeather(latitude, longitude);
          },
          () => { if (active) setVisitorWeather(null); },
          { enableHighAccuracy: false, timeout: 7000, maximumAge: 30 * 60 * 1000 }
        );
      }
    }

    const refreshTimer = window.setInterval(() => {
      refreshBusinessWeather();
      if (visitorCoordinates) {
        const { latitude, longitude } = visitorCoordinates;
        const cacheKey = 'mp-weather-visitor-' + latitude.toFixed(2) + '-' + longitude.toFixed(2);
        loadWeather(latitude, longitude, cacheKey)
          .then((data) => { if (active) setVisitorWeather(data); })
          .catch(() => { if (active) setVisitorWeather(null); });
      }
    }, CACHE_MS);

    return () => { active = false; window.clearInterval(refreshTimer); };
  }, []);

  const displayedWeather = visitorWeather ?? businessWeather;
  const kind = useMemo(
    () => displayedWeather ? weatherKind(displayedWeather.icon, displayedWeather.conditions) : 'sun',
    [displayedWeather]
  );

  return (
    <WeatherContext.Provider value={{ businessWeather, displayedWeather, visitorWeather, weatherUnavailable }}>
      {children}
      {displayedWeather && <WeatherLayer kind={kind} />}
    </WeatherContext.Provider>
  );
}

export function WeatherWidget() {
  const weather = useContext(WeatherContext);
  if (!weather) return null;
  const { businessWeather, visitorWeather, weatherUnavailable } = weather;
  const businessKind = businessWeather ? weatherKind(businessWeather.icon, businessWeather.conditions) : 'sun';

  return (
    <aside className="weather-widget glass-card" aria-label="Current weather at Manisha Properties office">
      <div className="flex items-center gap-3">
        <div className="weather-icon text-[#D4AF37]"><WeatherIcon kind={businessKind} size={28} /></div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,232,0.55)]">Office weather · Moti Nagar</div>
          {businessWeather ? (
            <div className="flex items-baseline gap-2">
              <AnimatedTemperature value={businessWeather.temp} />
              <span className="text-xs text-[rgba(248,244,232,0.7)]">{businessWeather.conditions}</span>
            </div>
          ) : (
            <div className="text-sm text-[rgba(248,244,232,0.65)]">{weatherUnavailable ? 'Weather temporarily unavailable' : 'Checking current weather…'}</div>
          )}
        </div>
      </div>
      {businessWeather && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[rgba(248,244,232,0.58)]">
          <span className="inline-flex items-center gap-1"><CloudDrizzle size={12} /> Feels {Math.round(businessWeather.feelslike)}°</span>
          <span className="inline-flex items-center gap-1"><Droplets size={12} /> {Math.round(businessWeather.humidity)}% humidity</span>
          <span className="inline-flex items-center gap-1"><Wind size={12} /> {Math.round(businessWeather.windspeed)} km/h</span>
        </div>
      )}
      <div className="mt-2 text-[10px] text-[rgba(248,244,232,0.42)]">
        Background: {visitorWeather ? 'Your area conditions' : 'Office conditions'} · <a href="https://www.visualcrossing.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#D4AF37]">Weather by Visual Crossing</a>
      </div>
    </aside>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

const VIDEO_ID = 'sB5GG5eczjs';

type YouTubePlayer = {
  mute: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

type YouTubeAPI = {
  Player: new (element: HTMLElement, options: {
    host: string;
    videoId: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady: () => void;
      onStateChange: (event: { data: number }) => void;
      onError: () => void;
      onAutoplayBlocked: () => void;
    };
  }) => YouTubePlayer;
  PlayerState: { PLAYING: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeAPI> | undefined;

function loadYouTubeAPI(): Promise<YouTubeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  const loading = new Promise<YouTubeAPI>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error('YouTube player unavailable'));
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('YouTube player could not load'));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    apiPromise = undefined;
    throw error;
  });

  apiPromise = loading;
  return loading;
}

export function HeroAdVideo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const visibleRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [manualRequested, setManualRequested] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.intersectionRatio >= 0.35 && document.visibilityState === 'visible';
      visibleRef.current = visible;
      if (visible) {
        setShouldLoad(true);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches || manualRequested) {
          playerRef.current?.playVideo();
        }
      } else {
        playerRef.current?.pauseVideo();
      }
    }, { threshold: [0, 0.35, 1] });

    observer.observe(frame);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') playerRef.current?.pauseVideo();
      else if (visibleRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        playerRef.current?.playVideo();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [manualRequested]);

  useEffect(() => {
    if (!shouldLoad || !playerHostRef.current) return;
    let disposed = false;

    loadYouTubeAPI().then((YT) => {
      if (disposed || !playerHostRef.current) return;
      playerRef.current = new YT.Player(playerHostRef.current, {
        host: 'https://www.youtube-nocookie.com',
        videoId: VIDEO_ID,
        playerVars: {
          controls: 1,
          playsinline: 1,
          origin: window.location.origin,
          rel: 0,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: () => {
            playerRef.current?.mute();
            if (visibleRef.current && document.visibilityState === 'visible' &&
              !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              playerRef.current?.playVideo();
            }
          },
          onStateChange: ({ data }) => {
            if (data === YT.PlayerState.PLAYING) setPlaying(true);
            if (data === YT.PlayerState.ENDED && visibleRef.current) {
              playerRef.current?.seekTo(0, true);
              playerRef.current?.playVideo();
            }
          },
          onError: () => setUnavailable(true),
          onAutoplayBlocked: () => setPlaying(false),
        },
      });
    }).catch(() => {
      if (!disposed) setUnavailable(true);
    });

    return () => {
      disposed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [shouldLoad]);

  const playManually = () => {
    setManualRequested(true);
    setShouldLoad(true);
    playerRef.current?.mute();
    playerRef.current?.playVideo();
  };

  return (
    <div ref={frameRef} className="relative w-full max-w-sm aspect-[2/3] glass-card-strong p-2" aria-label="Manisha Properties promotional video">
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0A0805]">
        <div ref={playerHostRef} className="absolute inset-0 h-full w-full" />
        <div className={`absolute inset-0 z-10 transition-opacity duration-500 motion-reduce:transition-none ${playing ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          <img
            src="/images/Manisha_Properties_visiting_card-640.webp"
            srcSet="/images/Manisha_Properties_visiting_card-400.webp 400w, /images/Manisha_Properties_visiting_card-640.webp 640w"
            sizes="(max-width: 640px) calc(100vw - 32px), 366px"
            alt="Manisha Properties visiting card with real estate consulting contact details"
            width={640}
            height={960}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
          {unavailable ? (
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 rounded-full border border-[#D4AF37] bg-[#0A0805]/90 px-4 py-2 text-sm text-[#F8F4E8]"
            >
              Open on YouTube
            </a>
          ) : (
            <button
              type="button"
              onClick={playManually}
              className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#0A0805]/90 px-4 py-2 text-sm font-medium text-[#F8F4E8] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
            >
              <Play size={16} aria-hidden="true" />
              Play video
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

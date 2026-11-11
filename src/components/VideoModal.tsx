import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Play, Volume2, VolumeX, X } from 'lucide-react';
import type { YouTubeVideo } from '../types/youtube';
import { ShareVideoButton } from './ShareVideoButton';

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

interface YouTubePlayer {
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  playVideo(): void;
  stopVideo(): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubePlayerStateEvent extends YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  host: string;
  playerVars: {
    autoplay: number;
    playsinline: number;
    rel: number;
    origin: string;
  };
  events: {
    onReady: (event: YouTubePlayerEvent) => void;
    onStateChange: (event: YouTubePlayerStateEvent) => void;
    onAutoplayBlocked: () => void;
    onError: () => void;
  };
}

interface YouTubeApi {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

type YouTubeWindow = Window & {
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
};

type PlaybackStatus = 'loading' | 'ready' | 'playing' | 'blocked' | 'ended' | 'error';

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

// Only the fixed, official YouTube API URL is loaded. Retry is possible after a load failure.
function loadYouTubeApi(): Promise<YouTubeApi> {
  const youtubeWindow = window as YouTubeWindow;
  if (youtubeWindow.YT?.Player) return Promise.resolve(youtubeWindow.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousReady = youtubeWindow.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    const timeout = window.setTimeout(() => fail(new Error('YouTube player did not become ready')), 12000);

    function cleanUp() {
      window.clearTimeout(timeout);
      script.onerror = null;
      if (youtubeWindow.onYouTubeIframeAPIReady === ready) {
        youtubeWindow.onYouTubeIframeAPIReady = previousReady;
      }
    }

    function ready() {
      cleanUp();
      previousReady?.();
      if (youtubeWindow.YT?.Player) resolve(youtubeWindow.YT);
      else reject(new Error('YouTube player API unavailable'));
    }

    function fail(error: Error) {
      cleanUp();
      script.remove();
      reject(error);
    }

    youtubeWindow.onYouTubeIframeAPIReady = ready;
    script.onerror = () => fail(new Error('Could not load YouTube player'));
    document.head.appendChild(script);
  }).catch(error => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('loading');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // The same focus trap, Escape handling and body-scroll restoration as the approved popup.
  useEffect(() => {
    if (!video) return;
    const priorOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && overlayRef.current) {
        const controls = Array.from(overlayRef.current.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = priorOverflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [video, onClose]);

  const videoId = video?.id.videoId;

  // Layout cleanup runs before React removes the portal's iframe on Close.
  useLayoutEffect(() => {
    if (!videoId) return;
    const playerHost = playerHostRef.current;
    let active = true;
    let started = false;
    let startupTimeout: number | undefined;
    setPlaybackStatus('loading');
    setSoundEnabled(false);

    const clearStartupTimeout = () => {
      if (startupTimeout !== undefined) window.clearTimeout(startupTimeout);
      startupTimeout = undefined;
    };
    const watchStartup = () => {
      clearStartupTimeout();
      startupTimeout = window.setTimeout(() => {
        if (active && !started) setPlaybackStatus('blocked');
      }, 6000);
    };

    void loadYouTubeApi().then(api => {
      if (!active || !playerHost) return;

      const mount = document.createElement('div');
      playerHost.replaceChildren(mount);
      const player = new api.Player(mount, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        // autoplay=0 prevents an unmuted attempt before onReady can mute the player.
        playerVars: { autoplay: 0, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (!active) return;
            const iframe = target.getIframe();
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.allowFullscreen = true;
            target.mute();
            setPlaybackStatus('ready');
            target.playVideo();
            watchStartup();
          },
          onStateChange: ({ data }) => {
            if (!active) return;
            if (data === 1) {
              started = true;
              clearStartupTimeout();
              setPlaybackStatus('playing');
            } else if (data === 0) {
              clearStartupTimeout();
              setPlaybackStatus('ended');
            }
          },
          onAutoplayBlocked: () => {
            if (!active || started) return;
            clearStartupTimeout();
            setPlaybackStatus('blocked');
          },
          onError: () => {
            if (!active) return;
            clearStartupTimeout();
            setPlaybackStatus('error');
          },
        },
      });
      playerRef.current = player;
    }).catch(() => {
      if (active) {
        clearStartupTimeout();
        setPlaybackStatus('error');
      }
    });

    return () => {
      active = false;
      clearStartupTimeout();
      const player = playerRef.current;
      playerRef.current = null;
      if (player) {
        try {
          // Do not send API commands to a frame React or YouTube already detached.
          if (player.getIframe().isConnected) player.stopVideo();
          player.destroy();
        } catch {
          // Remove the iframe even when the third-party API is already unavailable.
        }
      }
      playerHost?.replaceChildren();
    };
  }, [videoId]);

  if (!video) return null;

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const startManually = () => {
    const player = playerRef.current;
    if (!player) return;
    // A manual Play tap remains muted; sound requires its own deliberate gesture.
    player.mute();
    setSoundEnabled(false);
    // Keep the manual fallback available until PLAYING is confirmed.
    setPlaybackStatus('blocked');
    player.playVideo();
  };

  const toggleSound = () => {
    const player = playerRef.current;
    if (!player) return;
    if (soundEnabled) {
      player.mute();
      setSoundEnabled(false);
    } else {
      player.unMute();
      player.setVolume(100);
      setSoundEnabled(true);
    }
  };

  const publishDate = new Date(video.snippet.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${video.snippet.title}`}
      data-video-preview="open"
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto p-4 sm:p-6 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div className="relative my-auto w-full max-w-4xl animate-fade-in-up">
        <div className="flex flex-wrap justify-end items-center gap-3 pb-2">
          {playbackStatus === 'blocked' && (
            <button
              type="button"
              onClick={startManually}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-[#FFD700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD700]"
              aria-label="Play video manually"
            >
              <Play size={16} aria-hidden="true" /> Play video
            </button>
          )}
          {playbackStatus === 'playing' && (
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute video' : 'Turn on video sound'}
              aria-pressed={soundEnabled}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-[#D4AF37] hover:text-[#FFD700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD700]"
            >
              {soundEnabled ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              {soundEnabled ? 'Mute' : 'Turn on sound'}
            </button>
          )}
          <ShareVideoButton title={video.snippet.title} url={youtubeUrl} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-[#D4AF37] hover:text-[#FFD700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD700]" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video preview"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-[#F8F4E8] hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD700]"
          >
            <X size={18} aria-hidden="true" /> Close
          </button>
        </div>

        {/* Video Player: the official API creates the iframe inside this existing container. */}
        <div className="glass-card-strong overflow-hidden">
          <div ref={playerHostRef} className="youtube-container bg-black" aria-label={`YouTube player: ${video.snippet.title}`} />
          {playbackStatus === 'blocked' && (
            <p role="status" className="px-5 pt-3 text-sm text-[#F8F4E8]">
              Automatic playback was blocked. Select Play video above to start.
            </p>
          )}
          {playbackStatus === 'error' && (
            <p role="alert" className="px-5 pt-3 text-sm text-[#F8F4E8]">
              This video preview could not load. You can open it on YouTube below.
            </p>
          )}

          <div className="p-5 space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#F8F4E8] leading-tight">
              {video.snippet.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[rgba(248,244,232,0.5)]">
              <span className="px-2.5 py-1 rounded-full border border-[rgba(212,175,55,0.25)] text-[rgba(212,175,55,0.8)]">
                {video.snippet.channelTitle}
              </span>
              <span>{publishDate}</span>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[rgba(212,175,55,0.7)] hover:text-[#D4AF37] transition-colors ml-auto"
              >
                <ExternalLink size={12} />
                Open on YouTube
              </a>
            </div>
            <p className="text-xs text-[rgba(248,244,232,0.55)]">If the preview cannot play, open the video on YouTube.</p>
            {video.snippet.description && (
              <p className="text-xs text-[rgba(248,244,232,0.5)] leading-relaxed line-clamp-3">
                {video.snippet.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

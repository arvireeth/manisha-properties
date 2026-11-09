import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import type { YouTubeVideo } from '../types/youtube';
import { ShareVideoButton } from './ShareVideoButton';

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  if (!video) return null;

  const videoId = video.id.videoId;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
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
        <div className="flex justify-end pb-2">
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

        {/* Video Player */}
        <div className="glass-card-strong overflow-hidden">
          <div className="youtube-container bg-black">
            <iframe
              src={embedUrl}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="p-5 space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#F8F4E8] leading-tight">
              {video.snippet.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[rgba(248,244,232,0.5)]">
              <span className="px-2.5 py-1 rounded-full border border-[rgba(212,175,55,0.25)] text-[rgba(212,175,55,0.8)]">
                {video.snippet.channelTitle}
              </span>
              <span>{publishDate}</span>
              <ShareVideoButton title={video.snippet.title} url={youtubeUrl} className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#FFD700]" />
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

import { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { YouTubeVideo } from '../types/youtube';

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [video, onClose]);

  if (!video) return null;

  const videoId = video.id.videoId;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const publishDate = new Date(video.snippet.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div className="relative w-full max-w-4xl animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-[rgba(248,244,232,0.7)] hover:text-[#D4AF37] transition-colors group"
        >
          <span className="hidden sm:inline">Close</span>
          <div className="p-1.5 rounded-full border border-[rgba(255,255,255,0.2)] group-hover:border-[rgba(212,175,55,0.5)] transition-all">
            <X size={16} />
          </div>
        </button>

        {/* Video Player */}
        <div className="glass-card-strong overflow-hidden">
          <div className="border-b border-[rgba(212,175,55,0.15)] px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-[rgba(248,244,232,0.4)] truncate max-w-xs inline-block">
                youtube-nocookie.com/embed/{videoId}
              </span>
            </div>
          </div>

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
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[rgba(212,175,55,0.7)] hover:text-[#D4AF37] transition-colors ml-auto"
              >
                <ExternalLink size={12} />
                Watch on YouTube
              </a>
            </div>
            {video.snippet.description && (
              <p className="text-xs text-[rgba(248,244,232,0.5)] leading-relaxed line-clamp-3">
                {video.snippet.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

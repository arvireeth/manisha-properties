import { Play, Calendar } from 'lucide-react';
import type { YouTubeVideo } from '../types/youtube';

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  const thumbnail =
    video.snippet.thumbnails.maxres?.url ||
    video.snippet.thumbnails.standard?.url ||
    video.snippet.thumbnails.high?.url ||
    video.snippet.thumbnails.medium?.url ||
    video.snippet.thumbnails.default?.url ||
    '';

  const publishDate = new Date(video.snippet.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card glass-card border border-[rgba(212,175,55,0.15)] group block"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img
          src={thumbnail}
          alt={video.snippet.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="video-overlay">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37] blur-xl opacity-40" />
            <div className="relative p-4 rounded-full bg-[rgba(212,175,55,0.9)] shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              <Play size={24} className="text-[#0A0805] fill-[#0A0805] ml-0.5" />
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[rgba(0,0,0,0.75)] text-[10px] text-white font-medium backdrop-blur-sm">
          YouTube
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-[#F8F4E8] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
          {video.snippet.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-[rgba(248,244,232,0.45)]">
          <Calendar size={10} />
          {publishDate}
        </div>
        {video.snippet.description && (
          <p className="text-xs text-[rgba(248,244,232,0.4)] line-clamp-2 leading-relaxed">
            {video.snippet.description}
          </p>
        )}
      </div>
    </a>
  );
}

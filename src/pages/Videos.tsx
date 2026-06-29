import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Search, Youtube, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { useYouTube } from '../hooks/useYouTube';
import { VideoCard } from '../components/VideoCard';

export function Videos() {
  const { videos, loading, error, hasMore, loadMore } = useYouTube();
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? videos.filter(v =>
        v.snippet.title.toLowerCase().includes(search.toLowerCase()) ||
        v.snippet.description.toLowerCase().includes(search.toLowerCase())
      )
    : videos;

return (
  <>
    <Helmet>
  <title>
    Property Videos | Manisha Properties | Delhi NCR Real Estate
  </title>

  <meta
    name="description"
    content="Watch the latest property walkthroughs, investment opportunities, DLF projects and real estate updates from Manisha Properties across Delhi NCR."
  />

  <meta
    name="keywords"
    content="Property Videos, DLF Projects, Delhi NCR Real Estate, Property Tours, Apartments Delhi, Manisha Properties"
  />

  <link
    rel="canonical"
    href="https://manishaproperties.in/videos"
  />

  <meta
    property="og:title"
    content="Property Videos | Manisha Properties"
  />

  <meta
    property="og:description"
    content="Explore premium property walkthroughs and investment opportunities across Delhi NCR."
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:url"
    content="https://manishaproperties.in/videos"
  />

  <meta
    property="og:image"
    content="https://manishaproperties.in/images/Logo.jpg"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="Property Videos | Manisha Properties"
  />

  <meta
    name="twitter:description"
    content="Watch premium property tours and investment videos."
  />

  <meta
    name="twitter:image"
    content="https://manishaproperties.in/images/Logo.jpg"
  />
</Helmet>
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.07)] backdrop-blur-sm">
            <Youtube size={13} className="text-[#D4AF37]" />
            <span className="text-xs text-[#D4AF37] font-medium tracking-wide">Manisha Properties Channel</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">
            <span className="text-[#F8F4E8]">Property </span>
            <span className="gold-text">Videos</span>
          </h1>
          <p className="text-[rgba(248,244,232,0.6)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our complete collection of property tours, real estate insights, and investment
            guides — all in one place.
          </p>
          <div className="gold-divider max-w-[120px] mx-auto mt-4" />
        </div>

        {/* Search */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(212,175,55,0.6)]" />
            <input
              type="text"
              placeholder="Search property videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(212,175,55,0.25)] text-[#F8F4E8] placeholder-[rgba(248,244,232,0.35)] text-sm focus:outline-none focus:border-[rgba(212,175,55,0.6)] focus:bg-[rgba(255,255,255,0.09)] transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-6 text-sm text-[rgba(248,244,232,0.45)]">
            {search ? (
              <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</span>
            ) : (
              <span>{videos.length} video{videos.length !== 1 ? 's' : ''} loaded</span>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="p-4 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <div>
              <p className="text-[#F8F4E8] font-medium mb-1">Failed to load videos</p>
              <p className="text-sm text-[rgba(248,244,232,0.5)]">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-glass flex items-center gap-2 text-sm"
            >
              <RefreshCcw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && videos.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="bg-[rgba(212,175,55,0.05)]" style={{ paddingBottom: '56.25%', position: 'relative' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.05)] to-transparent animate-shimmer" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded bg-[rgba(255,255,255,0.05)]" />
                  <div className="h-3 rounded bg-[rgba(255,255,255,0.03)] w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {!error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(video => (
              <VideoCard key={video.id.videoId} video={video} />
            ))}
          </div>
        )}

        {/* Empty search result */}
        {!loading && !error && search && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <p className="text-[rgba(248,244,232,0.5)]">No videos found for "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-sm text-[#D4AF37] hover:text-[#FFD700] transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Load More */}
        {!error && hasMore && !search && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn-glass flex items-center gap-2 text-sm mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Videos'
              )}
            </button>
          </div>
        )}

        {/* Loading more indicator */}
        {loading && videos.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-10 text-[rgba(248,244,232,0.5)] text-sm">
            <Loader2 size={16} className="animate-spin text-[#D4AF37]" />
            Loading more videos...
          </div>
        )}

        {/* Subscribe CTA */}
        {!loading && !error && videos.length > 0 && (
          <div className="mt-20 text-center">
            <div className="inline-block glass-card-strong px-8 py-6 space-y-4">
              <Youtube size={32} className="text-[#D4AF37] mx-auto" />
              <p className="text-[#F8F4E8] font-serif font-semibold text-lg">
                Subscribe for More Property Updates
              </p>
              <p className="text-sm text-[rgba(248,244,232,0.55)] max-w-xs">
                Get notified when new property videos are published on our YouTube channel.
              </p>
              <a
                href={`https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 text-sm"
              >
                <Youtube size={16} />
                Subscribe Now
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  </>
);
}
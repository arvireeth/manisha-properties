
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Youtube,
  Play,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { useYouTube, YOUTUBE_PLAYLISTS } from '../hooks/useYouTube';
import { VideoCard } from '../components/VideoCard';

const playlists = [
  {
    title: 'Sale',
    description:
      'Explore residential properties for sale, premium apartment communities and attractive homes across Delhi NCR.',
    image: '/images/properties/sale.jpg',
    playlistId: YOUTUBE_PLAYLISTS.sale,
    imageAlt: 'Representative residential property photography for homes for sale',
  },
  {
    title: 'Rental',
    description:
      'Discover rental homes featuring comfortable living rooms, furnished bedrooms and modern interiors.',
    image: '/images/properties/rental.jpg',
    playlistId: YOUTUBE_PLAYLISTS.rental,
    imageAlt: 'Furnished apartment living room for rental properties',
  },
  {
    title: 'Purchased',
    description:
      'Explore premium apartments and completed property purchases through Manisha Properties.',
    image: '/images/properties/purchased.jpg',
    playlistId: YOUTUBE_PLAYLISTS.purchased,
    imageAlt: 'Premium completed apartment interior',
  },
  {
    title: 'Occupied',
    description:
      'Discover residential properties and homes ready for comfortable living.',
    image: '/images/properties/occupied.jpg',
    playlistId: YOUTUBE_PLAYLISTS.occupied,
    imageAlt: 'Representative residential property photography',
  },
];

const subscribeUrl =
  'https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw?sub_confirmation=1';

const whatsappUrl =
  'https://wa.me/918700204768?text=Hello%20Manisha%20Properties%2C%20I%20am%20interested%20in%20your%20property%20listings.%20Please%20share%20more%20details.';

type Playlist = (typeof playlists)[number];

function PlaylistVideos({ playlist }: { playlist: Playlist }) {
  const {
  videos,
  loading,
  error,
  hasMore,
  loadMore,
  refresh,
} = useYouTube(playlist.playlistId);

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      if (!document.hidden && !loading) {
        refresh();
      }
    }, 5 * 60 * 1000);

    return () => window.clearInterval(refreshInterval);
  }, [loading, refresh]);

  return (
    <div className="min-w-0 w-full">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            Manisha Properties
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F4E8] mt-2 break-words">
            {playlist.title} Videos
          </h3>
          <p className="text-sm text-[rgba(248,244,232,0.6)] mt-2">
            Explore our latest {playlist.title.toLowerCase()} property videos.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 min-w-0">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="btn-glass inline-flex min-h-11 items-center justify-center gap-2 text-sm whitespace-nowrap disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17110B]"
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span>
            {loading ? 'Refreshing...' : 'Refresh Videos'}
          </button>
          {videos.length > 0 && (
            <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs text-[#D4AF37]">
              {videos.length} loaded
            </span>
          )}
        </div>
      </div>

      {loading && videos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60 mt-4">
            Loading {playlist.title.toLowerCase()} videos...
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center"
        >
          <p className="text-sm text-red-300">
            Unable to load videos right now. Please close this window and
            select the category again to retry.
          </p>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <Youtube size={32} className="text-[#D4AF37] mx-auto mb-3" />
          <p className="text-white/70">
            No videos are currently available in this playlist.
          </p>
        </div>
      )}

      {videos.length > 0 && (
        <>
          <div className="video-gallery-grid">
            {videos.map((video) => (
              <VideoCard key={video.id.videoId} video={video} />
            ))}
          </div>

          {loading && (
            <p className="text-center text-sm text-white/50 mt-5">
              Loading more videos...
            </p>
          )}

          {hasMore && (
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="btn-glass inline-flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Videos'}
                <ChevronDown size={17} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlaylistModal({
  playlist,
  onSelect,
  onClose,
}: {
  playlist: Playlist;
  onSelect: (playlist: Playlist) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    dialogRef.current
      ?.querySelector<HTMLElement>('[aria-label="Close video gallery"]')
      ?.focus();

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element.offsetWidth > 0 || element.offsetHeight > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleFocusTrap);

    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-modal-title"
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex min-h-0 flex-col w-full max-w-6xl max-h-[calc(100vh-1rem)] max-h-[calc(100dvh-1rem)] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-[#D4AF37]/50 bg-[#17110B] shadow-2xl shadow-black/60"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shrink-0 border-b border-[#D4AF37]/20 bg-[#1D160D] px-3 py-3 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#D4AF37] font-semibold">
                Manisha Properties
              </span>
              <h2
                id="playlist-modal-title"
                className="font-serif text-xl sm:text-3xl font-bold leading-tight text-[#F8F4E8] mt-1 break-words"
              >
                Property Video Gallery
              </h2>
              <p className="text-xs sm:text-sm text-white/65 mt-1">
                Explore our property videos by category.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close video gallery"
              title="Close gallery"
              className="relative z-10 grid h-12 w-12 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-full border-2 border-[#FFE58A] bg-[#FFD700] text-[#17110B] shadow-[0_0_0_3px_rgba(255,215,0,0.18),0_4px_18px_rgba(0,0,0,0.55)] hover:bg-[#FFF0A8] hover:border-white active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D160D] transition-all"
            >
              <X size={25} strokeWidth={3} />
            </button>
          </div>

          <div
            className="flex gap-2 overflow-x-auto overscroll-x-contain mt-5 pb-2 -mb-1"
            role="tablist"
            aria-label="Property video categories"
          >
            {playlists.map((item) => {
              const active = item.title === playlist.title;

              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  id={`playlist-tab-${item.title.toLowerCase()}`}
                  aria-controls="playlist-videos-panel"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => onSelect(item)}
                  onKeyDown={(event) => {
                    const tabs = Array.from(
                      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
                    );
                    const currentIndex = tabs.indexOf(event.currentTarget);
                    let nextIndex = currentIndex;

                    if (event.key === 'ArrowRight') {
                      nextIndex = (currentIndex + 1) % tabs.length;
                    } else if (event.key === 'ArrowLeft') {
                      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    } else if (event.key === 'Home') {
                      nextIndex = 0;
                    } else if (event.key === 'End') {
                      nextIndex = tabs.length - 1;
                    } else {
                      return;
                    }

                    event.preventDefault();
                    tabs[nextIndex]?.focus();
                    onSelect(playlists[nextIndex]);
                  }}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all ${
                    active
                      ? 'bg-[#D4AF37] text-[#17110B] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-white/5 text-white/65 border-white/10 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </header>

        <div
          id="playlist-videos-panel"
          role="tabpanel"
          aria-labelledby={`playlist-tab-${playlist.title.toLowerCase()}`}
          tabIndex={0}
          className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-6 lg:p-7 focus:outline-none"
          key={playlist.playlistId}
        >
          <PlaylistVideos
            key={playlist.playlistId}
            playlist={playlist}
          />
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-[#1D160D] px-3 py-3 sm:px-5 md:px-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs text-white/40">
              Manisha Properties · Delhi NCR
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 inline-flex items-center rounded-md px-3 text-xs sm:text-sm font-semibold text-[#FFD700] hover:bg-[#D4AF37]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D160D] transition-colors"
            >
              Close Gallery
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function Videos() {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<Playlist | null>(null);
  const { search } = useLocation();

  useEffect(() => {
    const category = new URLSearchParams(search).get('category');
    setSelectedPlaylist(playlists.find((playlist) => playlist.title.toLowerCase() === category) ?? null);
  }, [search]);

  const visiblePlaylists = showAll ? playlists : playlists.slice(0, 2);

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  useEffect(() => {
    if (!selectedPlaylist) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPlaylist(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPlaylist]);

  return (
    <>
      <Helmet>
        <title>Property Videos | Manisha Properties | Delhi NCR Real Estate</title>
        <meta
          name="description"
          content="Explore property videos from Manisha Properties, including homes for sale, rental apartments, purchased properties and occupied homes across Delhi NCR."
        />
        <meta
          name="keywords"
          content="Property Videos, DLF Capital Greens, Delhi NCR Real Estate, Property Tours, Apartments Delhi, Manisha Properties"
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
          content="Explore property sale, rental, purchased and occupied home videos across Delhi NCR."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://manishaproperties.in/videos"
        />
        <meta
          property="og:image"
          content="https://manishaproperties.in/images/Logo.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Property Videos | Manisha Properties"
        />
        <meta
          name="twitter:description"
          content="Explore premium property tours and real estate videos."
        />
        <meta
          name="twitter:image"
          content="https://manishaproperties.in/images/Logo.jpg"
        />
      </Helmet>

      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-14 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.07)] backdrop-blur-sm">
              <Youtube size={15} className="text-[#D4AF37]" />
              <span className="text-xs text-[#D4AF37] font-medium tracking-wide">
                Manisha Properties Channel
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold">
              <span className="text-[#F8F4E8]">Property </span>
              <span className="gold-text">Videos</span>
            </h1>

            <p className="text-[rgba(248,244,232,0.6)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover premium homes, residential communities, rental
              opportunities and successful property journeys across Delhi NCR.
            </p>

            <div className="gold-divider max-w-[120px] mx-auto mt-4" />
          </header>

          <section
            aria-label="Featured residential community"
            className="mb-16"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[#171717]">
              <img
                src="/images/properties/sale.jpg"
                alt="Representative photograph of premium residential living"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/Logo.jpg';
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />

              <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold">
                  Premium Residential Living
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
                  Explore DLF Capital Greens
                </h2>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed mt-4 max-w-xl">
                  Discover premium residential communities and property
                  opportunities in Moti Nagar and across Delhi NCR with
                  Manisha Properties.
                </p>

                <p className="text-xs text-white/50 mt-3">
                  Representative stock photography; not an actual DLF
                  Capital Greens property photograph.
                </p>

                <a
                  href="https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Explore Manisha Properties YouTube Channel"
                  className="btn-gold inline-flex items-center gap-2 mt-6 text-sm"
                >
                  <Play size={15} fill="currentColor" />
                  Explore Manisha Properties YouTube Channel
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          <section
            aria-label="Property video categories"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
          >
            {visiblePlaylists.map((playlist) => {
              return (
                <button
                  key={playlist.title}
                  type="button"
                  onClick={() => handlePlaylistClick(playlist)}
                  aria-label={`View ${playlist.title} property videos`}
                  className="group glass-card-strong overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[rgba(212,175,55,0.65)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#171717]">
                    <img
                      src={playlist.image}
                      alt={playlist.imageAlt}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/images/Logo.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#171717] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play
                          size={27}
                          fill="currentColor"
                          className="ml-1"
                        />
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-5">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                        Manisha Properties
                      </span>
                      <h2 className="text-3xl font-serif font-bold text-white mt-1">
                        {playlist.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-sm text-[rgba(248,244,232,0.65)] leading-relaxed">
                      {playlist.description}
                    </p>

                    <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-[#D4AF37]">
                      <Youtube size={17} />
                      View Videos
                      <Play size={14} className="ml-auto" />
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          <div className="text-center mt-9">
            <button
              type="button"
              onClick={() => setShowAll((previous) => !previous)}
              aria-expanded={showAll}
              className="btn-glass inline-flex items-center gap-2 text-sm"
            >
              {showAll ? (
                <>
                  See Less <ChevronUp size={17} />
                </>
              ) : (
                <>
                  See More <ChevronDown size={17} />
                </>
              )}
            </button>
          </div>

          <section className="mt-20 text-center">
            <div className="inline-block glass-card-strong rounded-2xl px-7 py-8 sm:px-10 space-y-4 max-w-2xl w-full">
              <Youtube size={32} className="text-[#D4AF37] mx-auto" />

              <h2 className="text-[#F8F4E8] font-serif font-semibold text-xl sm:text-2xl">
                Subscribe for More Property Updates
              </h2>

              <p className="text-sm text-[rgba(248,244,232,0.55)] max-w-md mx-auto">
                Follow our YouTube channel for property tours, new listings and
                real estate updates across Delhi NCR.
              </p>

              <a
                href={subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 text-sm"
              >
                <Youtube size={16} />
                Subscribe Now
              </a>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                <a
                  href="tel:+918700204768"
                  className="btn-glass inline-flex items-center justify-center gap-2 text-sm"
                >
                  <Phone size={16} />
                  Call Manisha
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass inline-flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {selectedPlaylist && (
        <PlaylistModal
          playlist={selectedPlaylist}
          onSelect={setSelectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
        />
      )}
    </>
  );
}

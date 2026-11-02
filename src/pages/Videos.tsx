
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Youtube,
  Play,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

const playlists = [
  {
    title: 'Sale',
    description: 'Explore residential properties for sale, premium apartment communities and attractive homes across Delhi NCR.',
    image: '/images/properties/sale.jpg',
    url: 'https://www.youtube.com/playlist?list=PLYjkaPSA54tY',
    imageAlt: 'Representative residential property photography for homes for sale',
  },
  {
    title: 'Rental',
    description: 'Discover rental homes featuring comfortable living rooms, furnished bedrooms and modern interiors.',
    image: '/images/properties/rental.jpg',
    url: 'https://www.youtube.com/playlist?list=PLYo9ildZkhfo',
    imageAlt: 'Furnished apartment living room for rental properties',
  },
  {
    title: 'Purchased',
    description: 'Explore premium apartments and completed property purchases through Manisha Properties.',
    image: '/images/properties/purchased.jpg',
    url: 'https://www.youtube.com/playlist?list=PLJocVtGV0psw',
    imageAlt: 'Premium completed apartment interior',
  },
  {
    title: 'Occupied',
    description: 'Discover residential properties and homes ready for comfortable living.',
    image: '/images/properties/occupied.jpg',
    url: 'https://www.youtube.com/playlist?list=PLdmLuIEZE-sQ',
    imageAlt: 'Representative residential property photography',
  },
];

const subscribeUrl =
  'https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw?sub_confirmation=1';

const whatsappUrl =
  'https://wa.me/918700204768?text=Hello%20Manisha%20Properties%2C%20I%20am%20interested%20in%20your%20property%20listings.%20Please%20share%20more%20details.';

export function Videos() {
  const [showAll, setShowAll] = useState(false);

  const visiblePlaylists = showAll ? playlists : playlists.slice(0, 2);

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
        <link rel="canonical" href="https://manishaproperties.in/videos" />
        <meta property="og:title" content="Property Videos | Manisha Properties" />
        <meta
          property="og:description"
          content="Explore property sale, rental, purchased and occupied home videos across Delhi NCR."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://manishaproperties.in/videos" />
        <meta property="og:image" content="https://manishaproperties.in/images/Logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Property Videos | Manisha Properties" />
        <meta
          name="twitter:description"
          content="Explore premium property tours and real estate videos."
        />
        <meta name="twitter:image" content="https://manishaproperties.in/images/Logo.jpg" />
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
                  href="https://www.youtube.com/playlist?list=PLYjkaPSA54tY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2 mt-6 text-sm"
                >
                  <Play size={15} fill="currentColor" />
                  Explore Property Videos
                </a>
              </div>
            </div>
          </section>

          <section
            aria-label="Property video categories"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
          >
            {visiblePlaylists.map((playlist) => (
              <a
                key={playlist.title}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${playlist.title} property videos on YouTube`}
                className="group glass-card-strong overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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
                      <Play size={27} fill="currentColor" className="ml-1" />
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

                  <span className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white">
                    <ExternalLink size={17} />
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-sm text-[rgba(248,244,232,0.65)] leading-relaxed">
                    {playlist.description}
                  </p>
                  <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-[#D4AF37]">
                    <Youtube size={17} />
                    Watch Playlist
                    <ExternalLink size={14} className="ml-auto" />
                  </div>
                </div>
              </a>
            ))}
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
    </>
  );
}

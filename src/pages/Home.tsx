
import {
  Play,
  Home as HomeIcon,
  TrendingUp,
  Key,
  Building2,
  ChevronRight,
  ChevronLeft,
  Star,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useRef } from 'react';
import { useYouTube, YOUTUBE_PLAYLISTS } from '../hooks/useYouTube';
import { VideoCard } from '../components/VideoCard';
import { useNavigate } from 'react-router-dom';
import WhatsAppEnquiry from '../components/WhatsAppEnquiry';
import { WeatherWidget } from '../components/WeatherExperience';

const services = [
  { icon: HomeIcon, label: 'Sale', desc: 'Premium property sale listings across Delhi NCR' },
  { icon: Key, label: 'Rental', desc: 'Residential & commercial rental solutions' },
  { icon: TrendingUp, label: 'Pre-Rented', desc: 'Ready income-generating properties' },
  { icon: Building2, label: 'Property Management', desc: 'End-to-end property management services' },
];

const stats = [
  { value: '500+', label: 'Properties Sold' },
  { value: '10+', label: 'Years Experience' },
  { value: 'DLF', label: 'Channel Partner' },
  { value: '1000+', label: 'Happy Clients' },
];

function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch Sale and Rental videos independently.
  const sale = useYouTube(YOUTUBE_PLAYLISTS.sale);
  const rental = useYouTube(YOUTUBE_PLAYLISTS.rental);

  const loading = sale.loading || rental.loading;

  const featuredVideos = [
    ...sale.videos.slice(0, 6).map(video => ({
      video,
      category: 'Sale',
    })),
    ...rental.videos.slice(0, 6).map(video => ({
      video,
      category: 'Rental',
    })),
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Manisha Properties | DLF Channel Partner | Buy, Sell & Rent Properties in Delhi NCR
        </title>

        <meta
          name="description"
          content="Manisha Properties helps you buy, sell, rent and manage residential and commercial properties across Delhi NCR. Trusted DLF Channel Partner offering premium residential and commercial real estate solutions."
        />

        <meta
          name="keywords"
          content="Manisha Properties, Delhi NCR real estate, DLF Channel Partner, DLF Capital Greens, Moti Nagar properties, luxury apartments Delhi, flats for sale Delhi, rental properties Delhi, commercial properties Delhi NCR"
        />

        <link
          rel="canonical"
          href="https://manishaproperties.in/"
        />

        <meta
          property="og:title"
          content="Manisha Properties | DLF Channel Partner"
        />

        <meta
          property="og:description"
          content="Buy, Sell & Rent premium properties across Delhi NCR."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://manishaproperties.in/"
        />

        <meta
          property="og:image"
          content="https://manishaproperties.in/images/Logo.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manisha Properties" />

        <meta
          name="twitter:description"
          content="Buy, Sell & Rent properties in Delhi NCR"
        />

        <meta
          name="twitter:image"
          content="https://manishaproperties.in/images/Logo.jpg"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Manisha Properties Advisors & Consultants',
            url: 'https://manishaproperties.in',
            logo: 'https://manishaproperties.in/images/Logo.jpg',
            image: [
              'https://manishaproperties.in/images/Logo.jpg',
            ],
            telephone: '+91-8700204768',
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+91-8700204768',
                contactType: 'customer service',
                areaServed: [
                  'Delhi',
                  'Delhi NCR',
                  'Gurgaon',
                  'Noida',
                ],
                availableLanguage: [
                  'English',
                  'Hindi',
                ],
              },
            ],
            email: 'mailto:manishaguptaproperties@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Block 3, Ground Floor, CSP Unit No-1, DLF Capital Greens, Moti Nagar',
              addressLocality: 'Moti Nagar',
              addressRegion: 'Delhi',
              postalCode: '110015',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '28.660133',
              longitude: '77.153424',
            },
            description:
              'Real estate property buying, selling, rental and property management services in Moti Nagar and Delhi NCR.',
            makesOffer: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Property Buying',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Property Selling',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Property Rental',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Pre-Rented Property Investment',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Property Management',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Commercial Property Consulting',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Residential Property Consulting',
                },
              },
            ],
            sameAs: [
              'https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw',
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  width: `${60 + i * 40}px`,
                  height: `${60 + i * 40}px`,
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: `${5 + i}s`,
                  opacity: 0.06 + i * 0.02,
                }}
              />
            ))}
          </div>

          {/* Golden radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.07)] backdrop-blur-sm">
                  <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs text-[#D4AF37] font-medium tracking-wide">
                    DLF Authorized Channel Partner
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-[#F8F4E8]">Buy or rent at</span>
                  <br />
                  <span className="gold-text-shine">DLF Capital Greens</span>
                </h1>

                <p className="text-base sm:text-lg text-[rgba(248,244,232,0.65)] leading-relaxed max-w-xl">
                  Explore property tours in Moti Nagar and speak with Manisha Gupta about availability and viewings.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/videos?category=sale')}
                    className="btn-gold flex items-center gap-2 text-sm"
                  >
                    <Play size={16} className="fill-[#0A0805]" />
                    Browse properties for sale
                  </button>
                  <button type="button" onClick={() => navigate('/videos?category=rental')} className="btn-glass text-sm">
                    Browse rentals
                  </button>

                  <a
                    href="https://wa.me/918700204768?text=Hello%20Manisha%20Properties%2C%20I%20would%20like%20to%20enquire%20about%20a%20property."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass flex items-center gap-2 text-sm"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>

                  <a
                    href="tel:8700204768"
                    className="btn-glass flex items-center gap-2 text-sm"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                </div>

                <WeatherWidget />

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {stats.map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="font-serif text-xl sm:text-2xl font-bold gold-text">
                        {value}
                      </div>
                      <div className="text-xs text-[rgba(248,244,232,0.5)] mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Visiting Card + Glow */}
              <div
                className="relative flex items-center justify-center animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="relative">
                  {/* Glow rings */}
                  <div className="absolute inset-0 rounded-2xl bg-[rgba(212,175,55,0.15)] blur-3xl scale-110" />
                  <div className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.2)] animate-pulse-gold" />

                  <div className="relative glass-card-strong p-2 max-w-sm w-full mx-auto aspect-[2/3]">
                    <img
                      src="/images/Manisha_Properties_visiting_card-640.webp"
                      srcSet="/images/Manisha_Properties_visiting_card-400.webp 400w, /images/Manisha_Properties_visiting_card-640.webp 640w"
                      sizes="(max-width: 640px) calc(100vw - 32px), 366px"
                      alt="Manisha Properties visiting card with real estate consulting contact details"
                      width={640}
                      height={960}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full rounded-xl object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#D4AF37]" />
            <div className="text-[10px] text-[#D4AF37] tracking-widest uppercase">
              Scroll
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-3">
              <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">
                What We Offer
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                <span className="text-[#F8F4E8]">Our </span>
                <span className="gold-text">Services</span>
              </h2>

              <div className="gold-divider max-w-[120px] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="glass-card p-6 space-y-4 hover:border-[rgba(212,175,55,0.4)] transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.15)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] flex items-center justify-center group-hover:bg-[rgba(212,175,55,0.2)] transition-all">
                    <Icon size={22} className="text-[#D4AF37]" />
                  </div>

                  <div>
                    <h3 className="font-serif font-semibold text-[#F8F4E8] text-lg mb-1.5 group-hover:text-[#D4AF37] transition-colors">
                      {label}
                    </h3>

                    <p className="text-sm text-[rgba(248,244,232,0.55)] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos Section — Sale and Rental Carousel */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)',
            }}
          />

          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-3">
                <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">
                  From Our Channel
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                  <span className="text-[#F8F4E8]">Latest </span>
                  <span className="gold-text">Property Videos</span>
                </h2>

                <div className="gold-divider max-w-[120px] mt-4" />

                <p className="text-sm text-[rgba(248,244,232,0.5)]">
                  Explore our latest Sale and Rental properties.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => { sale.refresh(); rental.refresh(); }}
                  disabled={sale.loading || rental.loading}
                  className="min-h-10 text-sm text-[#D4AF37] underline underline-offset-4 hover:text-[#FFD700] disabled:opacity-50"
                >
                  Refresh videos
                </button>
                {/* Carousel navigation */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    aria-label="Scroll videos left"
                    className="w-10 h-10 rounded-full border border-[rgba(212,175,55,0.35)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    aria-label="Scroll videos right"
                    className="w-10 h-10 rounded-full border border-[rgba(212,175,55,0.35)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] transition-colors flex items-center justify-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <button
                  onClick={() => navigate('/videos')}
                  className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] transition-colors group font-medium"
                >
                  View All Videos
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex gap-6 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card animate-pulse shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                    style={{ paddingBottom: '22%' }}
                  >
                    <div className="absolute inset-0 bg-[rgba(212,175,55,0.03)] rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : featuredVideos.length > 0 ? (
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-5"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(212,175,55,0.45) transparent',
                }}
              >
                {featuredVideos.map(({ video, category }) => (
                  <div
                    key={`${category}-${video.id.videoId}`}
                    className="relative shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
                  >
                    <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-[rgba(10,8,5,0.88)] border border-[rgba(212,175,55,0.5)] text-xs font-semibold text-[#D4AF37]">
                      {category}
                    </div>

                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-[rgba(248,244,232,0.4)]">
                No Sale or Rental videos available at the moment.
              </div>
            )}

            {!loading && featuredVideos.length > 0 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('/videos')}
                  className="btn-glass text-sm"
                >
                  Explore All Property Videos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Visit our office — interactive OpenStreetMap */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
            <div className="space-y-5">
              <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">Visit Our Office</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold"><span className="text-[#F8F4E8]">Find Us </span><span className="gold-text">in Delhi</span></h2>
              <div className="gold-divider max-w-[120px]" />
              <a href="https://www.google.com/maps/dir/?api=1&destination=28.660133%2C77.153424" target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-3 text-[rgba(248,244,232,0.78)] hover:text-[#FFD700] transition-colors">
                <MapPin size={20} className="mt-1 shrink-0 text-[#D4AF37]" />
                <span className="leading-relaxed">Block 3, Ground Floor, CSP Unit No-1<br />DLF Capital Greens, Moti Nagar<br />New Delhi, Delhi 110015<br /><span className="text-sm text-[#D4AF37] underline underline-offset-4">Open directions</span></span>
              </a>
              <p className="text-sm text-[rgba(248,244,232,0.5)]">Explore the map, zoom in and move around to find our office entrance.</p>
            </div>
            <div className="office-map-shell glass-card-strong">
              <div className="office-map-marker" aria-hidden="true"><span /></div>
              <iframe
                title="Manisha Properties office map at DLF Capital Greens, Moti Nagar"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.1434%2C28.6540%2C77.1634%2C28.6662&layer=mapnik&marker=28.660133%2C77.153424"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="office-map-frame"
              />
              <div className="office-map-caption"><span>Manisha Properties · DLF Capital Greens</span><a href="https://www.openstreetmap.org/?mlat=28.660133&mlon=77.153424#map=17/28.660133/77.153424" target="_blank" rel="noopener noreferrer">View larger map</a></div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card-strong p-10 sm:p-14 text-center space-y-6 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium mb-4">
                  Get In Touch
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F8F4E8] mb-4">
                  Ready to Find Your<br />
                  <span className="gold-text">Perfect Property?</span>
                </h2>

                <p className="text-[rgba(248,244,232,0.6)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  Connect with Manisha Gupta today for personalized property consultation.
                  Expert advice, transparent dealings, and the best properties in Delhi NCR.
                </p>

                <WhatsAppEnquiry />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <a
                    href="tel:8700204768"
                    className="btn-gold flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                  >
                    <Phone size={16} />
                    +91 8700204768
                  </a>

                  <div className="flex items-center gap-2 text-sm text-[rgba(248,244,232,0.6)]">
                    <MapPin size={14} className="text-[#D4AF37]" />
                    DLF Capital Greens, Moti Nagar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;

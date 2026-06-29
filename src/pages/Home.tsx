import { Play, Home as HomeIcon, TrendingUp, Key, Building2, ChevronRight, Star, Phone, MapPin } from 'lucide-react';
import { Helmet } from "react-helmet-async";
import { useYouTube } from '../hooks/useYouTube';
import { VideoCard } from '../components/VideoCard';
import { useNavigate } from 'react-router-dom';

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
  const { videos, loading } = useYouTube();
  const featuredVideos = videos.slice(0, 6);

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
      <meta property="og:title"
        content="Manisha Properties | DLF Channel Partner" />

      <meta property="og:description"
        content="Buy, Sell & Rent premium properties across Delhi NCR." />

      <meta property="og:type"
        content="website" />

      <meta property="og:url"
        content="https://manishaproperties.in/" />

      <meta property="og:image"
        content="https://manishaproperties.in/images/Logo.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Manisha Properties" />
      <meta name="twitter:description"
        content="Buy, Sell & Rent properties in Delhi NCR" />
      <meta name="twitter:image"
        content="https://manishaproperties.in/images/Logo.jpg" />
      <script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",

  "name": "Manisha Properties Advisors & Consultants",

  "url": "https://manishaproperties.in",

  "logo": "https://manishaproperties.in/images/Logo.jpg",

  "image": "https://manishaproperties.in/images/Logo.jpg",

  "telephone": "+91-8700204768",

  "email": "manishaguptaproperties@gmail.com",

  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Moti Nagar",
    "addressRegion": "Delhi",
    "postalCode": "110015",
    "addressCountry": "IN"
  },

  "areaServed": [
    "Delhi",
    "Delhi NCR",
    "Gurgaon",
    "Noida"
  ],

  "description":
    "Trusted DLF Authorized Channel Partner providing property buying, selling, rental, investment consulting and property management services.",

  "priceRange": "₹₹",

  "sameAs": [
    "https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw"
  ]
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
                <span className="text-xs text-[#D4AF37] font-medium tracking-wide">DLF Authorized Channel Partner</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#F8F4E8]">Find Your</span>
                <br />
                <span className="gold-text-shine">Dream Property</span>
              </h1>

              <p className="text-base sm:text-lg text-[rgba(248,244,232,0.65)] leading-relaxed max-w-xl">
                Manisha Properties brings you exclusive real estate opportunities — from luxury homes
                to strategic investments. Expert guidance at every step of your property journey.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/videos')}
                  className="btn-gold flex items-center gap-2 text-sm"
                >
                  <Play size={16} className="fill-[#0A0805]" />
                  Watch Property Videos
                </button>
                <a
                  href="tel:8700204768"
                  className="btn-glass flex items-center gap-2 text-sm"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-serif text-xl sm:text-2xl font-bold gold-text">{value}</div>
                    <div className="text-xs text-[rgba(248,244,232,0.5)] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visiting Card + Glow */}
            <div className="relative flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Glow rings */}
                <div className="absolute inset-0 rounded-2xl bg-[rgba(212,175,55,0.15)] blur-3xl scale-110" />
                <div className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.2)] animate-pulse-gold" />

                <div className="relative glass-card-strong p-2 max-w-sm w-full mx-auto">
                  <img
                    src="/images/Manisha_Properties_visiting_card.PNG"
                    alt="Manisha Properties Real Estate Consultant Delhi NCR"
                    className="w-full rounded-xl object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#D4AF37]" />
          <div className="text-[10px] text-[#D4AF37] tracking-widest uppercase">Scroll</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">What We Offer</p>
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
                  <p className="text-sm text-[rgba(248,244,232,0.55)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-3">
              <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">From Our Channel</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                <span className="text-[#F8F4E8]">Latest </span>
                <span className="gold-text">Property Videos</span>
              </h2>
              <div className="gold-divider max-w-[120px] mt-4" />
            </div>
            <button
              onClick={() => navigate('/videos')}
              className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] transition-colors group font-medium self-start sm:self-auto"
            >
              View All Videos
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse" style={{ paddingBottom: '60%' }}>
                  <div className="absolute inset-0 bg-[rgba(212,175,55,0.03)] rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map(video => (
                <VideoCard key={video.id.videoId} video={video} />
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="text-center py-20 text-[rgba(248,244,232,0.4)]">
              No videos available at the moment.
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="glass-card-strong p-10 sm:p-14 text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)',
            }} />

            <div className="relative">
              <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium mb-4">Get In Touch</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F8F4E8] mb-4">
                Ready to Find Your<br />
                <span className="gold-text">Perfect Property?</span>
              </h2>
              <p className="text-[rgba(248,244,232,0.6)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Connect with Manisha Gupta today for personalized property consultation.
                Expert advice, transparent dealings, and the best properties in Delhi NCR.
              </p>

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
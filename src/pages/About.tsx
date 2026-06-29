import { Phone, MapPin, Award, Users, TrendingUp, Shield, Star, Youtube, CheckCircle } from 'lucide-react';
import { Helmet } from "react-helmet-async";
const achievements = [
  { icon: Award, label: 'DLF Channel Partner', desc: 'Official authorized partner for DLF properties' },
  { icon: Users, label: '1000+ Happy Clients', desc: 'Trusted by families and investors across Delhi NCR' },
  { icon: TrendingUp, label: '500+ Properties', desc: 'Successfully sold, rented, and managed properties' },
  { icon: Shield, label: '10+ Years Experience', desc: 'Deep expertise in Delhi NCR real estate market' },
];

const services = [
  'Residential Property Sale & Purchase',
  'Commercial Real Estate',
  'Property Rental Solutions',
  'Pre-Rented Investment Properties',
  'Property Renovation Guidance',
  'Complete Property Management',
  'DLF Project Consultation',
  'Real Estate Investment Advisory',
];

export function About() {
  return (
    <>
    <Helmet>
  <title>
    About Manisha Properties | Trusted DLF Channel Partner in Delhi NCR
  </title>

  <meta
    name="description"
    content="Learn about Manisha Properties, a trusted DLF Channel Partner offering property buying, selling, rentals, investment guidance and property management services across Delhi NCR."
  />

  <meta
    name="keywords"
    content="About Manisha Properties, DLF Channel Partner, Delhi NCR Property Consultant, Real Estate Advisor, Property Management, Moti Nagar"
  />

  <link
    rel="canonical"
    href="https://manishaproperties.in/about"
  />

  <meta
    property="og:title"
    content="About Manisha Properties"
  />

  <meta
    property="og:description"
    content="Trusted DLF Channel Partner serving Delhi NCR with premium real estate solutions."
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:url"
    content="https://manishaproperties.in/about"
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
    content="About Manisha Properties"
  />

  <meta
    name="twitter:description"
    content="Trusted Property Advisors & Consultants in Delhi NCR."
  />

  <meta
    name="twitter:image"
    content="https://manishaproperties.in/images/Logo.jpg"
  />
</Helmet>
    <div className="min-h-screen pt-28 pb-20">
      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212,175,55,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold">
              <span className="text-[#F8F4E8]">About </span>
              <span className="gold-text">Manisha Properties</span>
            </h1>
            <div className="gold-divider max-w-[120px] mx-auto mt-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Manisha Photo */}
            <div className="relative flex items-center justify-center order-first lg:order-first animate-fade-in">
              <div className="relative max-w-sm w-full mx-auto">
                {/* Glow effects */}
                <div className="absolute -inset-6 rounded-3xl bg-[rgba(212,175,55,0.12)] blur-3xl" />
                <div
                  className="absolute inset-0 rounded-3xl border border-[rgba(212,175,55,0.25)]"
                  style={{ transform: 'rotate(3deg)' }}
                />

                {/* Photo Frame */}
                <div className="relative glass-card-strong p-3">
                  <img
                    src="/images/Manisha_Gupta_Photo.jpg"
                    alt="Manisha Gupta"
                    className="w-full rounded-2xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    style={{ maxHeight: '480px', objectPosition: 'top' }}
                  />

                  {/* Name overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-card-strong px-4 py-3">
                      <div className="font-serif font-bold text-lg gold-text">Manisha Gupta</div>
                      <div className="text-xs text-[rgba(248,244,232,0.6)] mt-0.5">
                        Founder & Real Estate Consultant
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="text-[#D4AF37] fill-[#D4AF37]" />
                        ))}
                        <span className="text-[10px] text-[rgba(248,244,232,0.5)] ml-1">5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-5 text-[rgba(248,244,232,0.7)] leading-relaxed">
                <p className="text-base sm:text-lg">
                  <span className="font-serif text-[#D4AF37] font-semibold">Manisha Properties Advisors and Consultants</span> is
                  a premier real estate firm based in DLF Capital Greens, Moti Nagar, New Delhi — dedicated
                  to making your property journey seamless, transparent, and rewarding.
                </p>
                <p className="text-sm sm:text-base">
                  Founded by <strong className="text-[#F8F4E8]">Manisha Gupta</strong>, our firm has been a trusted
                  name in Delhi NCR real estate for over a decade. As an <strong className="text-[#F8F4E8]">authorized
                  DLF Channel Partner</strong>, we provide access to premium DLF developments along with a wide portfolio
                  of residential and commercial properties.
                </p>
                <p className="text-sm sm:text-base">
                  Our YouTube channel features detailed property tours, market insights, and investment tips
                  — making real estate knowledge accessible to everyone.
                </p>
              </div>

              {/* Services List */}
              <div>
                <h3 className="font-serif text-lg font-semibold gold-text mb-4">Our Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map(service => (
                    <div key={service} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="text-sm text-[rgba(248,244,232,0.7)]">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="tel:8700204768" className="btn-gold flex items-center gap-2 text-sm">
                  <Phone size={15} />
                  Call Manisha Gupta
                </a>
                <a
                  href="https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass flex items-center gap-2 text-sm"
                >
                  <Youtube size={15} />
                  Our YouTube Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">Our Track Record</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              <span className="text-[#F8F4E8]">Why Choose </span>
              <span className="gold-text">Manisha Properties</span>
            </h2>
            <div className="gold-divider max-w-[120px] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="glass-card p-7 text-center space-y-4 hover:-translate-y-2 hover:border-[rgba(212,175,55,0.4)] transition-all duration-300 group hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.15)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] flex items-center justify-center mx-auto group-hover:bg-[rgba(212,175,55,0.2)] transition-all">
                  <Icon size={24} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#F8F4E8] mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {label}
                  </h3>
                  <p className="text-xs text-[rgba(248,244,232,0.5)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office / Visiting Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs text-[rgba(212,175,55,0.7)] uppercase tracking-widest font-medium">Visit Us</p>
                <h2 className="font-serif text-3xl font-bold">
                  <span className="gold-text">Office Location</span>
                </h2>
                <div className="gold-divider max-w-[80px]" />
              </div>

              <div className="space-y-5">
                <div className="glass-card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-[rgba(212,175,55,0.7)] font-medium mb-1 uppercase tracking-wider">Address</div>
                    <div className="text-sm text-[rgba(248,244,232,0.8)] leading-relaxed">
                      Block 3, Ground Floor, CSP Unit No-1<br />
                      DLF Capital Greens, Moti Nagar<br />
                      New Delhi
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-[rgba(212,175,55,0.7)] font-medium mb-1 uppercase tracking-wider">Phone</div>
                    <a
                      href="tel:8700204768"
                      className="text-sm text-[rgba(248,244,232,0.8)] hover:text-[#D4AF37] transition-colors"
                    >
                      +91 8700204768
                    </a>
                  </div>
                </div>

                <div className="glass-card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center flex-shrink-0">
                    <Youtube size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-xs text-[rgba(212,175,55,0.7)] font-medium mb-1 uppercase tracking-wider">YouTube</div>
                    <a
                      href="https://www.youtube.com/channel/UCcIBFWyXF4YgSubKfLiallw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[rgba(248,244,232,0.8)] hover:text-[#D4AF37] transition-colors"
                    >
                      Manisha Properties Channel
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visiting Card */}
            <div className="relative flex items-center justify-center">
              <div className="relative max-w-xs w-full mx-auto">
                <div className="absolute -inset-4 rounded-3xl bg-[rgba(212,175,55,0.10)] blur-3xl" />
                <div className="relative glass-card-strong p-3">
                  <img
                    src="/images/Manisha_Properties_visiting_card.PNG"
                    alt="Manisha Properties Business Card"
                    className="w-full rounded-xl object-contain"
                  />
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
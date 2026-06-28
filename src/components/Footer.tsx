import { Phone, MapPin, Youtube, Home } from 'lucide-react';
import type { Page } from '../types/youtube';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-[rgba(212,175,55,0.15)]">
      <div className="absolute inset-0 bg-[rgba(10,8,5,0.8)] backdrop-blur-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logo.jpg"
                alt="Logo"
                className="h-14 w-14 rounded-full border-2 border-[rgba(212,175,55,0.4)] object-cover"
              />
              <div>
                <div className="font-serif font-bold text-xl gold-text">Manisha Properties</div>
                <div className="text-[10px] text-[rgba(248,244,232,0.5)] tracking-widest uppercase">
                  Advisors & Consultants
                </div>
              </div>
            </div>
            <p className="text-sm text-[rgba(248,244,232,0.55)] leading-relaxed">
              Your trusted real estate partner in Delhi NCR. DLF Channel Partner providing
              expert guidance for all property needs.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@ManishaProperties"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.2)] transition-all"
              >
                <Youtube size={18} />
              </a>
              <a
                href="tel:8700204768"
                className="p-2.5 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.2)] transition-all"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg gold-text">Quick Links</h3>
            <div className="gold-divider" />
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'Property Videos', page: 'videos' as Page },
                { label: 'About Manisha Gupta', page: 'about' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className="flex items-center gap-2 text-sm text-[rgba(248,244,232,0.6)] hover:text-[#D4AF37] transition-colors group"
                  >
                    <Home size={12} className="text-[rgba(212,175,55,0.4)] group-hover:text-[#D4AF37] transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs text-[rgba(248,244,232,0.5)] uppercase tracking-widest font-medium">Services</h4>
              {['Sale', 'Purchase', 'Rental', 'Pre-Rented', 'Renovation', 'Property Management'].map(s => (
                <div key={s} className="flex items-center gap-2 text-xs text-[rgba(248,244,232,0.5)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg gold-text">Contact Us</h3>
            <div className="gold-divider" />
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[rgba(248,244,232,0.65)] leading-relaxed">
                  Block 3, Ground Floor, CSP Unit No-1,<br />
                  DLF Capital Greens, Moti Nagar,<br />
                  New Delhi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4AF37] flex-shrink-0" />
                <a
                  href="tel:8700204768"
                  className="text-sm text-[rgba(248,244,232,0.65)] hover:text-[#D4AF37] transition-colors"
                >
                  +91 8700204768
                </a>
              </div>
              <div className="mt-4 p-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.05)]">
                <div className="text-xs text-[rgba(212,175,55,0.8)] font-medium mb-1">DLF Channel Partner</div>
                <div className="text-xs text-[rgba(248,244,232,0.5)]">Authorized partner for DLF properties in Delhi NCR</div>
              </div>
            </div>
          </div>
        </div>

        <div className="gold-divider mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[rgba(248,244,232,0.4)]">
          <div>© {new Date().getFullYear()} Manisha Properties Advisors and Consultants. All rights reserved.</div>
          <div className="gold-text text-xs">Trusted Real Estate Partner in Delhi NCR</div>
        </div>
      </div>
    </footer>
  );
}

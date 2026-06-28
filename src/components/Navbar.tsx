import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import type { Page } from '../types/youtube';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Property Videos', page: 'videos' },
    { label: 'About Us', page: 'about' },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,8,5,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.2)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
              <img
                src="/images/Logo.jpg"
                alt="Manisha Properties Logo"
                className="relative h-12 w-12 rounded-full object-cover border-2 border-[rgba(212,175,55,0.5)] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-serif font-bold gold-text leading-tight">
                Manisha Properties
              </div>
              <div className="text-[10px] text-[rgba(248,244,232,0.55)] tracking-widest uppercase">
                Advisors & Consultants
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`nav-link text-sm tracking-wide transition-colors ${
                  currentPage === page ? 'active text-[#D4AF37]' : 'text-[rgba(248,244,232,0.8)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:8700204768"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(212,175,55,0.4)] text-[#D4AF37] text-sm font-medium hover:bg-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.7)] transition-all duration-300"
            >
              <Phone size={14} />
              8700204768
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[rgba(10,8,5,0.97)] backdrop-blur-xl border-t border-[rgba(212,175,55,0.15)] px-4 py-4 space-y-1">
          {navItems.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => handleNav(page)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[rgba(212,175,55,0.3)]'
                  : 'text-[rgba(248,244,232,0.8)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#D4AF37]'
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href="tel:8700204768"
            className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-[#D4AF37] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.1)] transition-all mt-2"
          >
            <Phone size={14} />
            Call: 8700204768
          </a>
        </div>
      </div>
    </nav>
  );
}

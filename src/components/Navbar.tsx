import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import type { RequestInstall } from "../pages/InstallApp";

function Navbar({ canInstall, requestInstall, installedMode }: { canInstall: boolean; requestInstall: RequestInstall; installedMode: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  async function handleInstallClick(event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    if (!canInstall || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    try {
      if (!await requestInstall()) navigate("/install");
    } catch {
      navigate("/install");
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Property Videos", path: "/videos" },
    { label: "About Us", path: "/about" },
    ...(!installedMode ? [{ label: "Install App", path: "/install" }] : []),
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className={`app-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(10,8,5,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.2)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}

          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500 opacity-20 blur-md" />

              <img
                src="/images/Logo.jpg"
                alt="Manisha Properties"
                className="relative h-12 w-12 rounded-full object-cover border-2 border-[rgba(212,175,55,0.5)] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              />
            </div>

            <div className="min-w-0">
              <div className="whitespace-nowrap text-[13px] sm:text-base font-serif font-bold gold-text">
                Manisha Properties
              </div>

              <div className="whitespace-nowrap text-[8px] sm:text-[10px] text-[rgba(248,244,232,0.7)] tracking-[0.08em] sm:tracking-widest uppercase">
                Advisors & Consultants
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.path === "/install" ? handleInstallClick : undefined}
                aria-current={location.pathname === item.path ? "page" : undefined}
                className={`nav-link text-sm tracking-wide transition-colors ${
                  location.pathname === item.path
                    ? "text-[#D4AF37]"
                    : "text-[rgba(248,244,232,0.8)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Call */}

          <div className="hidden md:flex">
            <a
              href="tel:8700204768"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(212,175,55,0.4)] text-[#D4AF37]"
            >
              <Phone size={14} />
              8700204768
            </a>
          </div>

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-menu"
            className="md:hidden p-2 text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#100D08]"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      <div
        id="mobile-navigation-menu"
        hidden={!menuOpen}
        className="md:hidden bg-[rgba(10,8,5,0.97)] border-t border-[rgba(212,175,55,0.15)]"
      >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={location.pathname === item.path ? "page" : undefined}
              onClick={item.path === "/install" ? handleInstallClick : () => setMenuOpen(false)}
              className={`block px-5 py-4 ${
                location.pathname === item.path
                  ? "text-[#D4AF37]"
                  : "text-[rgba(248,244,232,0.8)]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <a
            href="tel:8700204768"
            className="block px-5 py-4 text-[#D4AF37]"
          >
            Call: 8700204768
          </a>
      </div>
    </nav>
  );
}

export default Navbar;

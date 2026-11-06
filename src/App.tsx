
import { Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShareContact from "./components/ShareContact";

import Home from "./pages/Home";
import { About } from "./pages/About";
import { Videos } from "./pages/Videos";
import PrivacyNotice from "./pages/PrivacyNotice";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    // Override the site's global smooth scrolling for route changes.
    root.style.scrollBehavior = "auto";
    void root.offsetHeight;
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only z-[200] rounded-md bg-[#FFD700] px-4 py-3 font-semibold text-[#100D08] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-4 focus:ring-white"
      >
        Skip to main content
      </a>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
        </Routes>
      </main>

      <Footer />
      <ShareContact />
    </div>
  );
}

export default App;

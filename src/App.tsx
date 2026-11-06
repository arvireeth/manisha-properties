
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
      <Navbar />

      <main className="flex-1">
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

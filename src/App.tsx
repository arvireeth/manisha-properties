
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShareContact from "./components/ShareContact";
import { WeatherExperience } from "./components/WeatherExperience";
import AnalyticsConsent from "./components/AnalyticsConsent";
import OpeningIntro from "./components/OpeningIntro";
import UpdatePrompt from "./components/UpdatePrompt";

import Home from "./pages/Home";
import { About } from "./pages/About";
import { Videos } from "./pages/Videos";
import PrivacyNotice from "./pages/PrivacyNotice";

import InstallApp, { type InstallPrompt } from "./pages/InstallApp";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [installedMode, setInstalledMode] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );

  const pendingPrompt = useRef<InstallPrompt | null>(null);

  async function requestInstall() {
    const prompt = pendingPrompt.current;
    if (!prompt) return;
    pendingPrompt.current = null;
    setInstallPrompt(null);
    return prompt.prompt();
  }

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const updateMode = () => setInstalledMode(media.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true);
    media.addEventListener('change', updateMode);
    window.addEventListener('appinstalled', updateMode);
    return () => {
      media.removeEventListener('change', updateMode);
      window.removeEventListener('appinstalled', updateMode);
    };
  }, []);

  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      pendingPrompt.current = event as InstallPrompt;
      setInstallPrompt(pendingPrompt.current);
    };
    const clearPrompt = () => {
      pendingPrompt.current = null;
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', clearPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', clearPrompt);
    };
  }, []);

  return (
    <WeatherExperience>
    <OpeningIntro />
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only z-[200] rounded-md bg-[#FFD700] px-4 py-3 font-semibold text-[#100D08] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-4 focus:ring-white"
      >
        Skip to main content
      </a>
      <Navbar canInstall={Boolean(installPrompt)} requestInstall={requestInstall} installedMode={installedMode} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/install" element={<InstallApp canInstall={Boolean(installPrompt)} requestInstall={requestInstall} installedMode={installedMode} />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
        </Routes>
      </main>

      <Footer installedMode={installedMode} />
      <ShareContact />
      <AnalyticsConsent />
      <UpdatePrompt />
    </div>
    </WeatherExperience>
  );
}

export default App;

import { useEffect, useState } from 'react';

// Android supplies a native splash from the manifest. iOS needs a startup
// image and a short in-app handoff after the WebKit view becomes available.
function isIosStandalone() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true);
}

export default function OpeningIntro() {
  const [visible, setVisible] = useState(isIosStandalone);

  useEffect(() => {
    if (!visible) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 500 : 1100);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="opening-intro" role="status" aria-label="Manisha Properties is opening">
      <img
        src="/icons/gold-logo-512.png"
        alt="Manisha Properties"
        className="opening-logo"
        fetchPriority="high"
      />
    </div>
  );
}

import { useEffect, useState } from 'react';

function shouldShowIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    if (sessionStorage.getItem('mp-intro-seen') === '1') return false;
    sessionStorage.setItem('mp-intro-seen', '1');
  } catch {
    // If session storage is unavailable, still show the intro for this mount.
  }
  return true;
}

export default function OpeningIntro() {
  // Decide during the first render, not in useEffect. This prevents the page
  // painting first and the logo overlay appearing a frame or two later.
  const [visible, setVisible] = useState(shouldShowIntro);

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setVisible(false), 1850);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="opening-intro" role="status" aria-label="Welcome to Manisha Properties">
      <div className="opening-intro-content">
        <div className="opening-logo-ring">
          <img src="/images/Logo.jpg" alt="" className="opening-logo" fetchPriority="high" />
        </div>
        <div className="opening-brand">Manisha Properties</div>
        <div className="opening-tagline">Advisors &amp; Consultants</div>
        <div className="opening-rule" />
      </div>
      <button type="button" className="opening-skip" onClick={() => setVisible(false)}>Skip intro</button>
    </div>
  );
}

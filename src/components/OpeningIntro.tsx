import { useEffect, useState } from 'react';

export default function OpeningIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem('mp-intro-seen') === '1'; } catch { /* Continue without session storage. */ }
    if (seen || reducedMotion) return;

    setVisible(true);
    try { sessionStorage.setItem('mp-intro-seen', '1'); } catch { /* Intro still works for this render. */ }
    const timeout = window.setTimeout(() => setVisible(false), 1750);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="opening-intro" role="status" aria-label="Welcome to Manisha Properties">
      <div className="opening-intro-content">
        <div className="opening-logo-ring">
          <img src="/images/Logo.jpg" alt="" className="opening-logo" />
        </div>
        <div className="opening-brand">Manisha Properties</div>
        <div className="opening-tagline">Advisors &amp; Consultants</div>
        <div className="opening-rule" />
      </div>
      <button type="button" className="opening-skip" onClick={() => setVisible(false)}>Skip intro</button>
    </div>
  );
}

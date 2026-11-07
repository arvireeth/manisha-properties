import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = 'G-0B88R2EHR4';
const CONSENT_KEY = 'mp-analytics-consent-v1';

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

function enableAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // The Google tag expects the arguments object used by its standard snippet.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('consent', 'default', { analytics_storage: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function AnalyticsConsent() {
  const [choice, setChoice] = useState<string | null>(() => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  });
  const { pathname } = useLocation();

  useEffect(() => {
    const manage = () => {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* Keep the choice prompt available. */ }
      setChoice(null);
    };
    window.addEventListener('mp:manage-analytics', manage);
    return () => window.removeEventListener('mp:manage-analytics', manage);
  }, []);

  useEffect(() => {
    if (choice !== 'accepted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      return;
    }
    enableAnalytics();
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [choice, pathname]);

  useEffect(() => {
    if (choice !== 'accepted') return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        window.gtag?.('event', 'phone_click', { link_domain: 'phone' });
      } else if (href.startsWith('https://wa.me/')) {
        window.gtag?.('event', 'whatsapp_click', { link_domain: 'whatsapp' });
      } else if (href.includes('youtube.com/watch')) {
        window.gtag?.('event', 'property_video_click', { link_domain: 'youtube' });
      }
    };
    const handleSubmit = (event: Event) => {
      if (event.target instanceof HTMLFormElement) {
        window.gtag?.('event', 'property_enquiry_start', { form_type: 'whatsapp_enquiry' });
      }
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [choice]);

  const saveChoice = (next: 'accepted' | 'rejected') => {
    try { localStorage.setItem(CONSENT_KEY, next); } catch { /* Consent choice remains for this view. */ }
    setChoice(next);
  };

  if (choice) return null;

  return (
    <aside
      aria-label="Analytics privacy choices"
      className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-3xl rounded-2xl border border-[#D4AF37]/40 bg-[#100D08] p-4 text-[#F8F4E8] shadow-2xl sm:bottom-6 sm:p-5"
    >
      <p className="font-semibold text-[#D4AF37]">Your privacy choices</p>
      <p className="mt-2 text-xs leading-6 text-white/75 sm:text-sm">
        We use optional Google Analytics to understand visits and improve this website. It is off unless you choose to allow it. We do not send enquiry text, names, email addresses, phone numbers or budget/location form entries to Analytics. You can change your choice later in the Privacy Notice.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => saveChoice('accepted')} className="btn-gold min-h-10 px-4 text-sm">Allow analytics</button>
        <button type="button" onClick={() => saveChoice('rejected')} className="btn-glass min-h-10 px-4 text-sm">Reject optional analytics</button>
      </div>
    </aside>
  );
}

export default AnalyticsConsent;

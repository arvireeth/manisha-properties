import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function ConnectionStatus() {
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <aside role="status" aria-live="polite" className="mx-4 mt-3 rounded-xl border border-[#D4AF37]/35 bg-[#1D160D] px-4 py-3 text-sm text-[#F8F4E8] sm:mx-6 lg:mx-auto lg:max-w-7xl">
      <span className="inline-flex items-center gap-2 font-semibold text-[#D4AF37]"><WifiOff size={17} aria-hidden="true" /> You're offline</span>
      <span className="mt-1 block text-white/70">Saved pages may still open. Live weather and videos need an internet connection.</span>
    </aside>
  );
}

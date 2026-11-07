import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateServiceWorker = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let active = true;
    let registration: ServiceWorkerRegistration | undefined;
    const check = async () => {
      if (document.hidden || !navigator.onLine || !registration) return;
      try {
        await registration.update();
        // A worker can already be waiting before this page registers its callback.
        if (active && registration.waiting) setUpdateAvailable(true);
      } catch {
        // Offline and temporary network failures should not interrupt browsing.
      }
    };
    const update = registerSW({
      immediate: true,
      onNeedRefresh() {
        if (active) setUpdateAvailable(true);
      },
      onRegisteredSW(_url, currentRegistration) {
        registration = currentRegistration;
        if (registration?.waiting && active) setUpdateAvailable(true);
        void check();
      },
      onRegisterError(error) {
        console.error('App update check failed', error);
      },
    });
    updateServiceWorker.current = update;

    const onVisible = () => {
      if (!document.hidden) void check();
    };
    const timer = window.setInterval(() => void check(), 60 * 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, []);

  if (!updateAvailable) return null;

  const applyUpdate = async () => {
    if (!updateServiceWorker.current) return;
    setUpdating(true);
    try {
      await updateServiceWorker.current(true);
    } catch {
      setUpdating(false);
      // Leave the prompt available so the visitor can retry.
    }
  };

  return (
    <aside className="app-update-prompt" role="status" aria-live="polite">
      <span>A new version is ready.</span>
      <div className="app-update-actions">
        <button type="button" onClick={() => void applyUpdate()} disabled={updating}>
          {updating ? 'Updating…' : 'Update'}
        </button>
        <button type="button" onClick={() => setUpdateAvailable(false)} disabled={updating}>
          Not now
        </button>
      </div>
    </aside>
  );
}

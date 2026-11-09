import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateServiceWorker = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let active = true;
    let registration: ServiceWorkerRegistration | undefined;
    let autoUntil = Date.now() + 30_000;
    let hiddenAt = 0;
    let applying = false;

    const applyIfFresh = () => {
      if (!active || applying || document.hidden || Date.now() > autoUntil) return false;
      const update = updateServiceWorker.current;
      if (!update) return false;
      applying = true;
      setUpdating(true);
      void update(true).catch(() => {
        if (!active) return;
        applying = false;
        setUpdating(false);
        setUpdateAvailable(true);
      });
      return true;
    };

    const handleAvailable = () => {
      if (!active) return;
      if (!applyIfFresh()) setUpdateAvailable(true);
    };

    const check = async () => {
      if (document.hidden || !navigator.onLine || !registration) return;
      try {
        await registration.update();
        // A worker can already be waiting before this page registers its callback.
        if (registration.waiting) handleAvailable();
      } catch {
        // Offline and temporary network failures should not interrupt browsing.
      }
    };
    const update = registerSW({
      immediate: true,
      onNeedRefresh() {
        handleAvailable();
      },
      onRegisteredSW(_url, currentRegistration) {
        registration = currentRegistration;
        if (registration?.waiting) handleAvailable();
        void check();
      },
      onRegisterError(error) {
        console.error('App update check failed', error);
      },
    });
    updateServiceWorker.current = update;

    const onInteraction = () => { autoUntil = 0; };
    const onVisible = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        return;
      }
      const installed = window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (installed && hiddenAt && Date.now() - hiddenAt >= 30_000) {
        // A resumed PWA may reuse the old page rather than start a new process.
        autoUntil = Date.now() + 15_000;
        if (registration?.waiting) handleAvailable();
      }
      hiddenAt = 0;
      void check();
    };
    const timer = window.setInterval(() => void check(), 60 * 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    window.addEventListener('pointerdown', onInteraction, { passive: true });
    window.addEventListener('keydown', onInteraction);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
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

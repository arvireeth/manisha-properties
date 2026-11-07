import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateServiceWorker = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let active = true;
    let registration: ServiceWorkerRegistration | undefined;
    const update = registerSW({
      onNeedRefresh() {
        if (active) setUpdateAvailable(true);
      },
      onRegisteredSW(_url, currentRegistration) {
        registration = currentRegistration;
      },
      onRegisterError(error) {
        console.error('App update check failed', error);
      },
    });
    updateServiceWorker.current = update;

    const check = () => {
      if (!document.hidden && navigator.onLine) void registration?.update().catch(() => {
        // Offline and temporary network failures should not interrupt browsing.
      });
    };
    const onVisible = () => {
      if (!document.hidden) check();
    };
    const timer = window.setInterval(check, 60 * 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', check);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', check);
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

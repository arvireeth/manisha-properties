
import { useRegisterSW } from "virtual:pwa-register/react";

function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("PWA service worker registered:", swUrl);

      if (registration) {
        console.log("PWA update checking enabled.");
      }
    },
    onRegisterError(error) {
      console.error("PWA service worker registration failed:", error);
    },
  });

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-4 right-4 z-[100] mx-auto max-w-md rounded-xl border border-[#D4AF37] bg-white p-4 shadow-xl"
    >
      <p className="text-sm font-semibold text-gray-900">
        {needRefresh
          ? "A new version of Manisha Properties is available."
          : "Manisha Properties is ready to work offline."}
      </p>

      <div className="mt-3 flex items-center gap-3">
        {needRefresh && (
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
}

export default PWAUpdatePrompt;

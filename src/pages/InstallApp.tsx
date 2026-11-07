import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

export interface InstallPrompt extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const installUrl = 'https://manishaproperties.in/install';

export default function InstallApp({ prompt, clearPrompt }: {
  prompt: InstallPrompt | null;
  clearPrompt: () => void;
}) {
  const [installed, setInstalled] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const isiPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  useEffect(() => {
    const onInstalled = () => setInstalled(true);
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  async function install() {
    if (!prompt) return;
    setBusy(true);
    setStatus('');
    try {
      const { outcome } = await prompt.prompt();
      if (outcome === 'accepted') setStatus('Installation accepted. Look for Manisha Properties on your Home Screen or in your apps.');
    } catch {
      setStatus('Use the browser steps below to install the app.');
    } finally {
      clearPrompt();
      setBusy(false);
    }
  }

  const android = <section className="glass-card p-6">
    <h2 className="font-serif text-2xl gold-text mb-3">Android</h2>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Open this link in Chrome. If you opened it inside WhatsApp, open it in Chrome first.</li>
      <li>Tap the three-dot menu, then <strong>Add to Home screen</strong>.</li>
      <li>Choose <strong>Install</strong> and confirm.</li>
    </ol>
  </section>;

  const apple = <section className="glass-card p-6">
    <h2 className="font-serif text-2xl gold-text mb-3">iPhone or iPad</h2>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Open this link in Safari. If you opened it inside WhatsApp, open it in Safari first.</li>
      <li>Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li>
      <li>Turn on <strong>Open as Web App</strong> if shown, then tap <strong>Add</strong>.</li>
    </ol>
  </section>;

  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-16 space-y-6 text-[#F8F4E8]">
      <Helmet>
        <title>Install Manisha Properties</title>
        <link rel="canonical" href={installUrl} />
      </Helmet>
      <h1 className="font-serif text-4xl font-bold gold-text">Install Manisha Properties</h1>
      <p>Add Manisha Properties to your Home Screen for quick access.</p>
      {installed ? <p role="status">Manisha Properties is open as an installed app.</p> :
        prompt && <button type="button" className="btn-gold" onClick={install} disabled={busy}>Install App</button>}
      <p role="status">{status}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {isiPhone ? <>{apple}{android}</> : <>{android}{apple}</>}
      </div>
      <a className="btn-glass inline-flex" href={`https://wa.me/?text=${encodeURIComponent('Install Manisha Properties: ' + installUrl)}`} target="_blank" rel="noopener noreferrer">
        Share install link on WhatsApp
      </a>
    </div>
  );
}

import { useState } from 'react';
import { Share2 } from 'lucide-react';

export function ShareVideoButton({ title, url, className = '' }: { title: string; url: string; className?: string }) {
  const [message, setMessage] = useState('');

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Link copied');
    } catch {
      window.prompt('Copy video link', url);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={() => void share()} className={className} aria-label={`Share ${title}`}>
        <Share2 size={16} aria-hidden="true" /> Share
      </button>
      {message && <span role="status" className="text-xs text-[#D4AF37]">{message}</span>}
    </span>
  );
}

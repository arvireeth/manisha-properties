import { useState, type FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '918700204768';

function WhatsAppEnquiry() {
  const [interest, setInterest] = useState('Buying a property');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = [
      'Hello Manisha Properties, I would like to enquire about a property.',
      `Requirement: ${interest}`,
      location.trim() ? `Preferred location: ${location.trim()}` : '',
      budget.trim() ? `Approximate budget: ${budget.trim()}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-2xl border border-[rgba(212,175,55,0.25)] bg-black/20 p-5 text-left sm:grid-cols-2 sm:p-6">
      <div className="sm:col-span-2">
        <h3 className="font-serif text-lg font-semibold text-[#F8F4E8]">Tell us what you are looking for</h3>
        <p className="mt-1 text-xs text-[rgba(248,244,232,0.5)]">Your details are sent to Manisha Properties only when you choose to continue to WhatsApp.</p>
      </div>

      <label className="block text-sm text-[rgba(248,244,232,0.75)]">
        I am interested in
        <select value={interest} onChange={(event) => setInterest(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#171109] px-3 text-sm text-[#F8F4E8] outline-none focus:border-[#D4AF37]">
          <option>Buying a property</option>
          <option>Renting a property</option>
          <option>Selling a property</option>
          <option>Pre-rented investment</option>
          <option>Property management</option>
          <option>Other property advice</option>
        </select>
      </label>

      <label className="block text-sm text-[rgba(248,244,232,0.75)]">
        Preferred location <span className="text-white/40">(optional)</span>
        <input value={location} onChange={(event) => setLocation(event.target.value)} maxLength={100} placeholder="e.g. Moti Nagar, Delhi NCR" className="mt-2 min-h-11 w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#171109] px-3 text-sm text-[#F8F4E8] placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
      </label>

      <label className="block text-sm text-[rgba(248,244,232,0.75)] sm:col-span-2">
        Approximate budget <span className="text-white/40">(optional)</span>
        <input value={budget} onChange={(event) => setBudget(event.target.value)} maxLength={80} placeholder="e.g. ₹1–2 crore" className="mt-2 min-h-11 w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#171109] px-3 text-sm text-[#F8F4E8] placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
      </label>

      <button type="submit" className="btn-gold flex min-h-12 items-center justify-center gap-2 text-sm sm:col-span-2">
        <MessageCircle size={17} />
        Continue on WhatsApp
        <Send size={15} />
      </button>
    </form>
  );
}

export default WhatsAppEnquiry;

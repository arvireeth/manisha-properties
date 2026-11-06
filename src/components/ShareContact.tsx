
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Share2,
  Phone,
  MessageCircle,
  Download,
  X,
  Globe,
  Youtube,
} from "lucide-react";

const PHONE_NUMBER = "+918700204768";
const WEBSITE_URL = "https://manishaproperties.in/";
const YOUTUBE_URL =
  "https://youtube.com/@manishaproperties?si=e495PhSN2FmjJ9F8";

function ShareContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [websiteQR, setWebsiteQR] = useState("");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    dialogRef.current
      ?.querySelector<HTMLElement>('[aria-label="Close share panel"]')
      ?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element.offsetWidth > 0 || element.offsetHeight > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeys);

    return () => {
      document.removeEventListener("keydown", handleDialogKeys);
      trigger?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    const generateQR = async () => {
      try {
        const qrData = await QRCode.toDataURL(WEBSITE_URL, {
          width: 640,
          margin: 4,
          errorCorrectionLevel: "H",
        });

        const loadImage = (src: string): Promise<HTMLImageElement> =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src;
          });

        const [qrImage, logoImage] = await Promise.all([
          loadImage(qrData),
          loadImage("/images/Logo.jpg"),
        ]);

        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 640;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(qrImage, 0, 0, 640, 640);

        const boxSize = 160;
        const logoSize = 120;
        const center = (640 - boxSize) / 2;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(center, center, boxSize, boxSize);

        const scale = Math.min(
          logoSize / logoImage.width,
          logoSize / logoImage.height
        );

        const width = logoImage.width * scale;
        const height = logoImage.height * scale;

        ctx.drawImage(
          logoImage,
          (640 - width) / 2,
          (640 - height) / 2,
          width,
          height
        );

        if (!cancelled) {
          setWebsiteQR(canvas.toDataURL("image/png"));
        }
      } catch (error) {
        console.error("QR generation failed:", error);
      }
    };

    generateQR();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Manisha Properties",
      text: "Explore properties with Manisha Properties.",
      url: WEBSITE_URL,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(WEBSITE_URL);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } else {
        window.prompt("Copy our website link:", WEBSITE_URL);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Sharing failed:", error);
      }
    }
  };

  const downloadWebsiteQR = () => {
    if (!websiteQR) return;

    const link = document.createElement("a");
    link.href = websiteQR;
    link.download = "Manisha-Properties-Website-QR.png";
    link.click();
  };

  const whatsappURL = `https://wa.me/${PHONE_NUMBER.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    "Hello Manisha Properties, I would like to know more about your properties."
  )}`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-6 right-5 z-[80] flex flex-col items-end gap-3">
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Share Manisha Properties"
            ref={dialogRef}
            tabIndex={-1}
            className="w-[min(340px,calc(100vw-40px))] max-h-[75vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/40 bg-[#100D08] p-5 text-[#F8F4E8] shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#D4AF37]">
                  Manisha Properties
                </h2>
                <p className="mt-1 text-xs text-white/60">
                  Connect and share with us
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close share panel"
                className="rounded-full p-2 text-white/70 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-3 text-sm text-[#D4AF37] hover:bg-[#D4AF37]/20"
              >
                <Phone size={18} />
                Call Us
              </a>

              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-3 text-sm text-[#7DE6A2] hover:bg-[#25D366]/20"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>

            <button
              onClick={handleShare}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] p-3 text-sm font-semibold text-[#100D08] hover:bg-[#E6C65A]"
            >
              <Share2 size={18} />
              Share Website
            </button>

            {copied && (
              <p className="mt-2 text-center text-xs text-[#D4AF37]">
                Website link copied!
              </p>
            )}

            <div className="my-5 border-t border-white/10" />

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-[#D4AF37]">
                <Globe size={17} />
                Scan Our Website QR
              </div>

              {websiteQR ? (
                <img
                  src={websiteQR}
                  alt="Manisha Properties website QR code with logo"
                  className="mx-auto w-40 rounded-lg bg-white p-2"
                />
              ) : (
                <p className="py-6 text-xs text-white/50">
                  Generating QR code...
                </p>
              )}

              <button
                onClick={downloadWebsiteQR}
                disabled={!websiteQR}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/40 px-4 py-2 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-40"
              >
                <Download size={15} />
                Download Website QR
              </button>
            </div>

            <div className="my-5 border-t border-white/10" />

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-[#D4AF37]">
                <Youtube size={18} />
                Follow Us on YouTube
              </div>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="/images/Manisha_YouTube_QR.PNG"
                  alt="Scan to visit Manisha Properties YouTube channel"
                  className="mx-auto w-40 rounded-lg bg-white p-2"
                />
              </a>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#B91C1C] px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                <Youtube size={16} />
                Subscribe to Our Channel
              </a>
            </div>

            <p className="mt-4 text-center text-[10px] text-white/40">
              Manisha Properties · Advisors & Consultants
            </p>
          </div>
        )}

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close share options" : "Open share options"}
          aria-expanded={isOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#F8E6A0] bg-[#D4AF37] text-[#100D08] shadow-[0_4px_25px_rgba(212,175,55,0.4)] transition hover:scale-105 hover:bg-[#E6C65A]"
        >
          {isOpen ? <X size={25} /> : <Share2 size={25} />}
        </button>
      </div>
    </>
  );
}

export default ShareContact;

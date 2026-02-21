import { useState, useEffect, useRef } from "react";
import { exportCardAsImage } from "../../utils/cardExporter.ts";
import { exportCharacterAsPdf } from "../../utils/pdfExporter.ts";

// ============================================================
// DOWNLOAD MENU
// ============================================================

interface DownloadMenuProps {
  characterName: string;
  shareCardRef: React.RefObject<HTMLDivElement | null>;
  pdfCardRef: React.RefObject<HTMLDivElement | null>;
}

export function DownloadMenu({
  characterName,
  shareCardRef,
  pdfCardRef,
}: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "card" | "pdf" | "done">(
    "idle",
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const slug = characterName.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCardDownload = async () => {
    if (!shareCardRef.current) return;
    setOpen(false);
    setStatus("card");
    try {
      await exportCardAsImage(shareCardRef.current, slug);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  const handlePdfDownload = async () => {
    if (!pdfCardRef.current) return;
    setOpen(false);
    setStatus("pdf");
    try {
      await exportCharacterAsPdf(pdfCardRef.current, slug);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  if (status === "card" || status === "pdf") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400">
        <svg
          className="h-3 w-3 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {status === "card" ? "Rendering..." : "Building PDF..."}
      </span>
    );
  }

  if (status === "done") {
    return (
      <span className="inline-flex items-center rounded bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400">
        Saved!
      </span>
    );
  }

  const itemClass =
    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-gray-600 hover:text-gray-100";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Download options"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
          <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
        </svg>
        Download
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
          <button
            onClick={() => void handleCardDownload()}
            className={itemClass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3 shrink-0"
            >
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v1.401a2.986 2.986 0 0 0-1.5-.401h-9A2.986 2.986 0 0 0 2 6.901V3.5Z" />
              <path d="M2 9.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Zm6.5.75a.75.75 0 0 0-1.5 0v1.69l-.72-.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72v-1.69Z" />
            </svg>
            Card PNG
          </button>
          <button
            onClick={() => void handlePdfDownload()}
            className={`${itemClass} border-t border-gray-600`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 3.5a.75.75 0 0 1 .75.75v2.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l.72.72V6.25A.75.75 0 0 1 8 5.5Z"
                clipRule="evenodd"
              />
            </svg>
            Full PDF
          </button>
        </div>
      )}
    </div>
  );
}

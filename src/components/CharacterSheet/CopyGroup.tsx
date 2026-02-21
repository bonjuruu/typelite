import { useState } from "react";
import type { Character } from "../../engine/types/index.ts";
import { exportCharacterToText } from "../../utils/characterExporter.ts";
import { copyCardToClipboard } from "../../utils/cardExporter.ts";

// ============================================================
// COPY GROUP
// ============================================================

interface CopyGroupProps {
  character: Character;
  characterName: string;
  shareCardRef: React.RefObject<HTMLDivElement | null>;
}

export function CopyGroup({
  character,
  characterName,
  shareCardRef,
}: CopyGroupProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [cardStatus, setCardStatus] = useState<
    "idle" | "exporting" | "copied" | "downloaded"
  >("idle");

  const slug = characterName.toLowerCase().replace(/\s+/g, "-");

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyText = async () => {
    const text = exportCharacterToText(character, characterName);
    await navigator.clipboard.writeText(text);
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  };

  const handleCopyCard = async () => {
    if (!shareCardRef.current) return;
    setCardStatus("exporting");
    try {
      const copiedToClipboard = await copyCardToClipboard(
        shareCardRef.current,
        slug,
      );
      setCardStatus(copiedToClipboard ? "copied" : "downloaded");
      setTimeout(() => setCardStatus("idle"), 2000);
    } catch {
      setCardStatus("idle");
    }
  };

  const segmentBase =
    "inline-flex items-center gap-1.5 bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200";
  const dividerClass = "border-l border-gray-600";

  return (
    <span className="inline-flex">
      {/* Copy Link */}
      <button
        onClick={() => void handleCopyLink()}
        aria-label="Copy character link to clipboard"
        className={`${segmentBase} whitespace-nowrap rounded-l`}
      >
        {linkCopied ? (
          "Copied!"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path
                fillRule="evenodd"
                d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 2.632 2.88l.069-.044.024-.018 2-2a2 2 0 0 0 0-2.83.75.75 0 0 1 0-1.06l.36-.003Zm-1.829 3.95a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-2.632-2.88l-.069.044-.024.018-2 2a2 2 0 0 0 0 2.83.75.75 0 0 1 0 1.06l-.36.003Z"
                clipRule="evenodd"
              />
            </svg>
            Link
          </>
        )}
      </button>

      {/* Copy Text */}
      <button
        onClick={() => void handleCopyText()}
        aria-label="Copy character as text"
        className={`${segmentBase} ${dividerClass}`}
      >
        {textCopied ? (
          "Copied!"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path
                fillRule="evenodd"
                d="M10.986 3H12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.014A2.25 2.25 0 0 1 7.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM9.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z"
                clipRule="evenodd"
              />
            </svg>
            Text
          </>
        )}
      </button>

      {/* Copy Card */}
      <button
        onClick={() => void handleCopyCard()}
        disabled={cardStatus === "exporting"}
        aria-label="Copy character card image to clipboard"
        className={`${segmentBase} ${dividerClass} rounded-r`}
      >
        {cardStatus === "exporting" ? (
          "Rendering..."
        ) : cardStatus === "copied" ? (
          "Copied!"
        ) : cardStatus === "downloaded" ? (
          "Saved!"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v1.401a2.986 2.986 0 0 0-1.5-.401h-9A2.986 2.986 0 0 0 2 6.901V3.5Z" />
              <path d="M2 9.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Zm6.5.75a.75.75 0 0 0-1.5 0v1.69l-.72-.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72v-1.69Z" />
            </svg>
            Card
          </>
        )}
      </button>
    </span>
  );
}

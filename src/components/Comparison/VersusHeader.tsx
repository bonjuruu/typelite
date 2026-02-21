import type { ComparisonSlot } from "../../types/comparison.ts";

const closeIconSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-3.5 w-3.5"
  >
    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
  </svg>
);

// ============================================================
// VERSUS HEADER
// ============================================================

interface VersusHeaderProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
  onClearSlot: (slot: "A" | "B") => void;
  onClearAll: () => void;
}

export function VersusHeader({
  slotA,
  slotB,
  onClearSlot,
  onClearAll,
}: VersusHeaderProps) {
  return (
    <div className="relative flex items-center justify-between px-5 py-4">
      {/* A side */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onClearSlot("A")}
          className="group rounded p-1 text-gray-600 transition-colors hover:bg-indigo-950/40 hover:text-indigo-400"
          aria-label="Clear slot A"
          title="Clear A"
        >
          {closeIconSvg}
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            A
          </span>
          <p className="text-sm font-bold text-gray-100">{slotA.name}</p>
          <p className="text-xs text-gray-500">
            {slotA.character.archetype.className}
          </p>
        </div>
      </div>

      {/* VS divider */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800">
          <span className="text-[10px] font-black tracking-tight text-gray-400">
            VS
          </span>
        </div>
      </div>

      {/* B side */}
      <div className="flex items-center gap-2.5">
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            B
          </span>
          <p className="text-sm font-bold text-gray-100">{slotB.name}</p>
          <p className="text-xs text-gray-500">
            {slotB.character.archetype.className}
          </p>
        </div>
        <button
          onClick={() => onClearSlot("B")}
          className="group rounded p-1 text-gray-600 transition-colors hover:bg-amber-950/40 hover:text-amber-400"
          aria-label="Clear slot B"
          title="Clear B"
        >
          {closeIconSvg}
        </button>
        <div className="ml-1 border-l border-gray-800 pl-2.5">
          <button
            onClick={onClearAll}
            className="rounded px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-red-950/30 hover:text-red-400"
            aria-label="Clear comparison"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

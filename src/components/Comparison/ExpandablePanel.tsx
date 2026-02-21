import { useState } from "react";

// ============================================================
// EXPANDABLE PANEL
// ============================================================

interface ExpandablePanelProps {
  title: string;
  teaser?: string;
  accentColor?: "amber" | "gray";
  children: React.ReactNode;
}

export function ExpandablePanel({
  title,
  teaser,
  accentColor,
  children,
}: ExpandablePanelProps) {
  const [open, setOpen] = useState(false);

  const teaserColorClass =
    accentColor === "amber" ? "text-amber-500/70" : "text-gray-600";

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-300"
      >
        <span
          className={`text-[10px] transition-transform ${open ? "rotate-90" : ""}`}
        >
          &#9656;
        </span>
        <span className="flex-1">{title}</span>
        {teaser && !open && (
          <span
            className={`text-[9px] font-normal normal-case tracking-normal ${teaserColorClass}`}
          >
            {teaser}
          </span>
        )}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

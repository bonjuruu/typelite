// ============================================================
// SYSTEM ENTRY
// ============================================================

interface SystemEntryProps {
  name: string;
  arrow: string;
  what: string;
  why: string | React.ReactNode;
}

export function SystemEntry({ name, arrow, what, why }: SystemEntryProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-100">{name}</h3>
        <span className="rounded-full bg-indigo-600/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
          &rarr; {arrow}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-300">What it measures: </span>
        {what}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-300">Why this mapping: </span>
        {why}
      </p>
    </div>
  );
}

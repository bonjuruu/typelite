// ============================================================
// COMBAT FIELD
// ============================================================

interface CombatFieldProps {
  label: string;
  value: string;
  hint?: string;
}

export function CombatField({ label, value, hint }: CombatFieldProps) {
  return (
    <div
      className={hint ? "group/combat relative" : ""}
      tabIndex={hint ? 0 : undefined}
      role={hint ? "button" : undefined}
      aria-label={hint ? `${label} details` : undefined}
    >
      <span className="text-xs text-gray-500">{label}</span>
      <p className="font-medium text-gray-200">{value}</p>
      {hint && (
        <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 w-64 rounded bg-gray-950 px-2.5 py-2 text-[11px] leading-relaxed text-gray-400 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover/combat:opacity-100 group-focus-within/combat:opacity-100">
          {hint}
        </span>
      )}
    </div>
  );
}

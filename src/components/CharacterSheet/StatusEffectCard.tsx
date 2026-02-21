// ============================================================
// STATUS EFFECT CARD
// ============================================================

interface StatusEffectCardProps {
  label: string;
  name: string;
  description: string;
  variant: "positive" | "negative";
  lineContext?: string;
}

export function StatusEffectCard({
  label,
  name,
  description,
  variant,
  lineContext,
}: StatusEffectCardProps) {
  const borderColor =
    variant === "positive" ? "border-green-800" : "border-red-800";
  const labelColor = variant === "positive" ? "text-green-400" : "text-red-400";

  return (
    <div className={`rounded border ${borderColor} bg-gray-900 p-3`}>
      <span className={`text-xs font-semibold uppercase ${labelColor}`}>
        {label}
        {lineContext && (
          <span className="ml-1 text-gray-600">(line {lineContext})</span>
        )}
      </span>
      <p className="mt-1 text-sm font-medium text-gray-200">{name}</p>
      <p className="mt-0.5 text-xs text-gray-500">{description}</p>
    </div>
  );
}

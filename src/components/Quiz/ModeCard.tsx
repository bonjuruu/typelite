// ============================================================
// MODE CARD
// ============================================================

interface ModeCardProps {
  title: string;
  description: string;
  questionCount: number;
  selected: boolean;
  onClick: () => void;
}

export function ModeCard({
  title,
  description,
  questionCount,
  selected,
  onClick,
}: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-5 text-left transition-colors ${
        selected
          ? "border-indigo-500 bg-indigo-950/30"
          : "border-gray-700 bg-gray-800/60 hover:border-gray-600 hover:bg-gray-800"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-100">{title}</span>
        <span className="text-sm text-gray-500">
          ~{questionCount} questions
        </span>
      </div>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </button>
  );
}

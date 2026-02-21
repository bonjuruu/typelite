interface ToggleProps {
  checked: boolean;
  onChange?: () => void;
  "aria-label": string;
  size?: "sm" | "md";
}

const SIZE_CONFIG = {
  sm: { track: "h-5 w-9", dot: "h-4 w-4", translate: "translate-x-4" },
  md: { track: "h-6 w-11", dot: "h-5 w-5", translate: "translate-x-5" },
} as const;

export function Toggle({
  checked,
  onChange,
  "aria-label": ariaLabel,
  size = "md",
}: ToggleProps) {
  const config = SIZE_CONFIG[size];

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`relative ${config.track} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-900 ${
        checked ? "bg-indigo-600" : "bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 ${config.dot} rounded-full bg-white transition-transform ${
          checked ? config.translate : "translate-x-0"
        }`}
      />
    </button>
  );
}

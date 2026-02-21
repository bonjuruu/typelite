import type { StatName } from "../engine/types/index.ts";

export const STAT_CONFIG: {
  key: StatName;
  label: string;
  shortLabel: string;
  tailwindColor: string;
  hexColor: string;
}[] = [
  {
    key: "willpower",
    label: "Willpower",
    shortLabel: "WIL",
    tailwindColor: "bg-amber-500",
    hexColor: "#f59e0b",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    shortLabel: "INT",
    tailwindColor: "bg-blue-500",
    hexColor: "#3b82f6",
  },
  {
    key: "spirit",
    label: "Spirit",
    shortLabel: "SPR",
    tailwindColor: "bg-purple-500",
    hexColor: "#a855f7",
  },
  {
    key: "vitality",
    label: "Vitality",
    shortLabel: "VIT",
    tailwindColor: "bg-green-500",
    hexColor: "#22c55e",
  },
];

export const STAT_LABELS: Record<StatName, string> = Object.fromEntries(
  STAT_CONFIG.map((s) => [s.key, s.label]),
) as Record<StatName, string>;

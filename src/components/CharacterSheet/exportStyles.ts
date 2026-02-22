/** Shared color palette for export cards (PDF + share image). */
export const COLORS = {
  bgDeep: "#0a0a1a",
  bgCard: "#1f2937",
  bgInput: "#111827",
  border: "#374151",
  borderAccent: "#312e81",
  borderPositive: "#166534",
  borderNegative: "#991b1b",
  textPrimary: "#f3f4f6",
  textSecondary: "#e5e7eb",
  textTertiary: "#d1d5db",
  textMuted: "#9ca3af",
  textLabel: "#6b7280",
  textFooter: "#4b5563",
  accent: "#818cf8",
  positive: "#4ade80",
  negative: "#f87171",
  tagBg: "#374151",
} as const;

export const FONT_FAMILY = "system-ui, -apple-system, sans-serif";

/** Shared uppercase section label style. */
export const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 1.5,
  color: COLORS.textLabel,
  marginBottom: 8,
};

/** Shared horizontal divider style. */
export const dividerStyle: React.CSSProperties = {
  borderTop: `1px solid ${COLORS.bgCard}`,
  margin: "20px 0",
};

/** Per-slot left-border colors for ability cards. */
export const SLOT_BORDER_COLORS: Record<string, string> = {
  hero: "#d97706",
  parent: "#2563eb",
  child: "#9333ea",
  inferior: "#4b5563",
};

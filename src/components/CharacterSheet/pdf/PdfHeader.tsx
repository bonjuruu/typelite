import { COLORS } from "../exportStyles.ts";

interface PdfHeaderProps {
  characterName: string;
  title: string;
  activeSystems: string[];
}

export function PdfHeader({
  characterName,
  title,
  activeSystems,
}: PdfHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: COLORS.textPrimary,
          lineHeight: 1.2,
        }}
      >
        {characterName}
      </div>
      <div style={{ fontSize: 18, color: COLORS.accent, marginTop: 4 }}>
        {title}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap" as const,
        }}
      >
        {activeSystems.map((systemId) => (
          <span
            key={systemId}
            style={{
              background: COLORS.border,
              color: COLORS.textTertiary,
              borderRadius: 12,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {systemId}
          </span>
        ))}
      </div>
    </div>
  );
}

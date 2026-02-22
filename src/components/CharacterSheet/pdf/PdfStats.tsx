import type { Character } from "../../../engine/types/index.ts";
import { MAX_STAT } from "../../../engine/modifiers.ts";
import { STAT_CONFIG } from "../../../data/index.ts";
import { COLORS, sectionLabelStyle } from "../exportStyles.ts";

interface PdfStatsProps {
  stats: Character["stats"];
}

export function PdfStats({ stats }: PdfStatsProps) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={sectionLabelStyle}>Stats</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STAT_CONFIG.map(({ key, label, hexColor }) => {
          const value = stats[key];
          const pct = Math.min((value / MAX_STAT) * 100, 100);
          return (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 100,
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.textTertiary,
                }}
              >
                {label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 14,
                  borderRadius: 7,
                  background: COLORS.bgCard,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: 7,
                    background: hexColor,
                  }}
                />
              </div>
              <span
                style={{
                  width: 30,
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

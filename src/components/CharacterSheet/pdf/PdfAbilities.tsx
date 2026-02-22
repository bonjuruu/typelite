import type { Character } from "../../../engine/types/index.ts";
import { computeAbilityPower } from "../../../engine/modifiers.ts";
import { SLOT_LABELS } from "../../../data/index.ts";
import { COLORS, SLOT_BORDER_COLORS, sectionLabelStyle } from "../exportStyles.ts";

interface PdfAbilitiesProps {
  abilities: Character["abilities"];
  stats: Character["stats"];
}

export function PdfAbilities({ abilities, stats }: PdfAbilitiesProps) {
  if (abilities.length === 0) return null;

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={sectionLabelStyle}>Abilities</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {abilities.map((ability) => {
          const power = computeAbilityPower(ability, stats);
          const borderColor = SLOT_BORDER_COLORS[ability.slot] ?? "#4b5563";
          return (
            <div
              key={ability.slot}
              style={{
                background: COLORS.bgInput,
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.textLabel,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {SLOT_LABELS[ability.slot]} -{" "}
                  {ability.cognitiveFunction}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.textTertiary,
                    background: COLORS.border,
                    borderRadius: 4,
                    padding: "2px 8px",
                  }}
                >
                  {power}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.textSecondary,
                  marginTop: 4,
                }}
              >
                {ability.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                {ability.description}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap" as const,
                  marginTop: 6,
                }}
              >
                {ability.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: COLORS.bgCard,
                      color: COLORS.textMuted,
                      borderRadius: 10,
                      padding: "2px 8px",
                      fontSize: 10,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { Character } from "../../../engine/types/index.ts";
import { COLORS, sectionLabelStyle } from "../exportStyles.ts";

interface PdfArchetypeProps {
  archetype: Character["archetype"];
}

export function PdfArchetype({ archetype }: PdfArchetypeProps) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={sectionLabelStyle}>Archetype</div>
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>
          {archetype.className}
        </div>
        <div
          style={{
            fontSize: 12,
            color: COLORS.textMuted,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {archetype.description}
        </div>
        {/* Empowered / Stressed */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: COLORS.bgDeep,
              border: `1px solid ${COLORS.borderPositive}`,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                color: COLORS.positive,
              }}
            >
              Empowered
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginTop: 4,
              }}
            >
              {archetype.empoweredState.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textLabel,
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {archetype.empoweredState.description}
            </div>
          </div>
          <div
            style={{
              background: COLORS.bgDeep,
              border: `1px solid ${COLORS.borderNegative}`,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                color: COLORS.negative,
              }}
            >
              Stressed
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginTop: 4,
              }}
            >
              {archetype.stressedState.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textLabel,
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {archetype.stressedState.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

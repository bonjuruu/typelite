import type { Character } from "../../../engine/types/index.ts";
import { ELEMENT_EMOJI } from "../../../data/index.ts";
import { COLORS, sectionLabelStyle } from "../exportStyles.ts";

interface PdfCombatProps {
  element: Character["element"];
  combatBehavior: Character["combatBehavior"];
}

export function PdfCombat({ element, combatBehavior }: PdfCombatProps) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
    >
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: 14,
        }}
      >
        <div style={sectionLabelStyle}>Element</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>
            {ELEMENT_EMOJI[element.element]}
          </span>
          <div>
            <div
              style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}
            >
              {element.element}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>
              {element.quadra} quadra
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            background: COLORS.bgDeep,
            borderRadius: 6,
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              color: COLORS.textLabel,
            }}
          >
            Passive - {element.passiveTrait.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.textTertiary,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {element.passiveTrait.description}
          </div>
        </div>
      </div>
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: 14,
        }}
      >
        <div style={sectionLabelStyle}>Combat</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
          {combatBehavior.combatOrientation}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: COLORS.textLabel }}>
              Activation
            </div>
            <div
              style={{ fontSize: 12, fontWeight: 500, color: COLORS.textTertiary }}
            >
              {combatBehavior.activationStyle}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: COLORS.textLabel }}>
              Positioning
            </div>
            <div
              style={{ fontSize: 12, fontWeight: 500, color: COLORS.textTertiary }}
            >
              {combatBehavior.positioning}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: COLORS.textLabel }}>
              Regen Source
            </div>
            <div
              style={{ fontSize: 12, fontWeight: 500, color: COLORS.textTertiary }}
            >
              {combatBehavior.regenSource}
            </div>
          </div>
        </div>
        {combatBehavior.passives.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                color: COLORS.textLabel,
                marginBottom: 4,
              }}
            >
              Passives
            </div>
            {combatBehavior.passives.map((passive) => (
              <div
                key={passive.name + passive.source}
                style={{ marginBottom: 4 }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.textTertiary,
                  }}
                >
                  {passive.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.textLabel,
                    lineHeight: 1.3,
                  }}
                >
                  {passive.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

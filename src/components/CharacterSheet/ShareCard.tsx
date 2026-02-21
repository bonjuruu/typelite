import { forwardRef } from "react";
import type { Character } from "../../engine/types/index.ts";
import { computeAbilityPower, MAX_STAT } from "../../engine/modifiers.ts";
import { generateSystemInsights } from "../../engine/insights.ts";
import { STAT_CONFIG, ELEMENT_EMOJI } from "../../data/index.ts";
import { COLORS, FONT_FAMILY } from "./exportStyles.ts";

// ============================================================
// PROPS
// ============================================================

interface ShareCardProps {
  character: Character;
  characterName: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const SHORT_SLOT_LABELS: Record<string, string> = {
  hero: "H",
  parent: "P",
  child: "C",
  inferior: "I",
};

// ============================================================
// COMPONENT — fixed-size card for image export
// ============================================================

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ character, characterName }, ref) {
    const insightList = generateSystemInsights(character).slice(0, 2);

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          height: 800,
          padding: 32,
          fontFamily: FONT_FAMILY,
          background: `linear-gradient(180deg, ${COLORS.bgDeep} 0%, ${COLORS.bgInput} 50%, ${COLORS.bgDeep} 100%)`,
          color: COLORS.textPrimary,
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: -9999,
          top: -9999,
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {characterName}
          </div>
          <div style={{ fontSize: 16, color: COLORS.accent, marginTop: 4 }}>
            {character.title}
          </div>
        </div>

        {/* Insights (compact, max 2) */}
        {insightList.length > 0 && (
          <div
            style={{
              marginBottom: 12,
              padding: 8,
              background: "#1e1b4b20",
              border: "1px solid #312e8140",
              borderRadius: 6,
            }}
          >
            {insightList.map((insight, index) => (
              <div
                key={index}
                style={{
                  fontSize: 10,
                  color: COLORS.textMuted,
                  lineHeight: 1.4,
                  marginBottom: index < insightList.length - 1 ? 4 : 0,
                }}
              >
                <span style={{ color: COLORS.accent, marginRight: 4 }}>&bull;</span>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: COLORS.textLabel,
              marginBottom: 8,
            }}
          >
            Stats
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {STAT_CONFIG.map(({ key, shortLabel, hexColor }) => {
              const value = character.stats[key];
              return (
                <div key={key} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: hexColor }}>
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: COLORS.textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {shortLabel}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Stat bars */}
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            {STAT_CONFIG.map(({ key, hexColor }) => {
              const pct = Math.min(
                (character.stats[key] / MAX_STAT) * 100,
                100,
              );
              return (
                <div
                  key={key}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: COLORS.bgCard,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 2,
                      background: hexColor,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Archetype */}
        <div
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: COLORS.textLabel,
              marginBottom: 4,
            }}
          >
            Archetype
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
            {character.archetype.className}
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {character.archetype.description.length > 120
              ? character.archetype.description.slice(0, 120) + "..."
              : character.archetype.description}
          </div>
        </div>

        {/* Abilities — compact grid */}
        {character.abilities.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: COLORS.textLabel,
                marginBottom: 6,
              }}
            >
              Abilities
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {character.abilities.map((ability) => {
                const power = computeAbilityPower(ability, character.stats);
                return (
                  <div
                    key={ability.slot}
                    style={{
                      background: COLORS.bgInput,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 6,
                      padding: 8,
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
                        }}
                      >
                        {SHORT_SLOT_LABELS[ability.slot]} —{" "}
                        {ability.cognitiveFunction}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.textTertiary,
                          background: COLORS.border,
                          borderRadius: 4,
                          padding: "1px 6px",
                        }}
                      >
                        {power}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: COLORS.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      {ability.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Element + Combat — side by side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: COLORS.textLabel,
                marginBottom: 4,
              }}
            >
              Element
            </div>
            <div style={{ fontSize: 20, lineHeight: 1 }}>
              {ELEMENT_EMOJI[character.element.element]}{" "}
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
                {character.element.element}
              </span>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
              {character.element.quadra} quadra
            </div>
          </div>
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: COLORS.textLabel,
                marginBottom: 4,
              }}
            >
              Combat
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
              {character.combatBehavior.combatOrientation}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
              {character.combatBehavior.activationStyle} /{" "}
              {character.combatBehavior.positioning}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: COLORS.textFooter }}>
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>Type</span>lite
          </div>
        </div>
      </div>
    );
  },
);

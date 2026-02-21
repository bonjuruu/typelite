import { forwardRef } from "react";
import type { Character } from "../../engine/types/index.ts";
import { computeAbilityPower, MAX_STAT } from "../../engine/modifiers.ts";
import { STAT_CONFIG, SLOT_LABELS, ELEMENT_EMOJI } from "../../data/index.ts";
import {
  COLORS,
  FONT_FAMILY,
  sectionLabelStyle,
  dividerStyle,
} from "./exportStyles.ts";

// ============================================================
// PROPS
// ============================================================

interface PdfExportCardProps {
  character: Character;
  characterName: string;
  report: string | null;
  backstory: string | null;
}

const SLOT_BORDER_COLORS: Record<string, string> = {
  hero: "#d97706",
  parent: "#2563eb",
  child: "#9333ea",
  inferior: "#4b5563",
};

// ============================================================
// STYLES
// ============================================================

const PAGE_WIDTH = 794; // A4 at 96dpi

const baseStyle: React.CSSProperties = {
  width: PAGE_WIDTH,
  fontFamily: FONT_FAMILY,
  background: COLORS.bgDeep,
  color: COLORS.textPrimary,
  position: "absolute",
  left: -9999,
  top: -9999,
};

// ============================================================
// COMPONENT
// ============================================================

export const PdfExportCard = forwardRef<HTMLDivElement, PdfExportCardProps>(
  function PdfExportCard({ character, characterName, report, backstory }, ref) {
    return (
      <div ref={ref} style={baseStyle}>
        {/* Page 1: Character Overview */}
        <div style={{ padding: 40 }}>
          {/* Header */}
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
              {character.title}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap" as const,
              }}
            >
              {character.activeSystems.map((systemId) => (
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

          <div style={dividerStyle} />

          {/* Stats */}
          <div style={{ marginBottom: 4 }}>
            <div style={sectionLabelStyle}>Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STAT_CONFIG.map(({ key, label, hexColor }) => {
                const value = character.stats[key];
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

          <div style={dividerStyle} />

          {/* Archetype */}
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
                {character.archetype.className}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.textMuted,
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                {character.archetype.description}
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
                    {character.archetype.empoweredState.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.textLabel,
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {character.archetype.empoweredState.description}
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
                    {character.archetype.stressedState.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.textLabel,
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {character.archetype.stressedState.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={dividerStyle} />

          {/* Abilities */}
          {character.abilities.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div style={sectionLabelStyle}>Abilities</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {character.abilities.map((ability) => {
                  const power = computeAbilityPower(ability, character.stats);
                  const borderColor =
                    SLOT_BORDER_COLORS[ability.slot] ?? "#4b5563";
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
          )}

          <div style={dividerStyle} />

          {/* Element + Quadra + Combat */}
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
                  {ELEMENT_EMOJI[character.element.element]}
                </span>
                <div>
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}
                  >
                    {character.element.element}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {character.element.quadra} quadra
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
                  Passive - {character.element.passiveTrait.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.textTertiary,
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {character.element.passiveTrait.description}
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
                {character.combatBehavior.combatOrientation}
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
                    {character.combatBehavior.activationStyle}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textLabel }}>
                    Positioning
                  </div>
                  <div
                    style={{ fontSize: 12, fontWeight: 500, color: COLORS.textTertiary }}
                  >
                    {character.combatBehavior.positioning}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textLabel }}>
                    Regen Source
                  </div>
                  <div
                    style={{ fontSize: 12, fontWeight: 500, color: COLORS.textTertiary }}
                  >
                    {character.combatBehavior.regenSource}
                  </div>
                </div>
              </div>
              {character.combatBehavior.passives.length > 0 && (
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
                  {character.combatBehavior.passives.map((passive) => (
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
        </div>

        {/* Page 2+: Report & Backstory */}
        {(report || backstory) && (
          <div style={{ padding: 40, borderTop: `2px solid ${COLORS.bgCard}` }}>
            {report && (
              <div style={{ marginBottom: backstory ? 32 : 0 }}>
                <div style={sectionLabelStyle}>Typology Report</div>
                <div
                  style={{
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.borderAccent}`,
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.textTertiary,
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {report}
                  </div>
                </div>
              </div>
            )}

            {backstory && (
              <div>
                {report && <div style={dividerStyle} />}
                <div style={sectionLabelStyle}>Backstory</div>
                <div
                  style={{
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.textTertiary,
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {backstory}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.textFooter }}>
                <span style={{ color: COLORS.accent, fontWeight: 600 }}>Type</span>
                lite
              </div>
            </div>
          </div>
        )}

        {/* Footer for page 1 only (when no report/backstory) */}
        {!report && !backstory && (
          <div style={{ padding: "0 40px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: COLORS.textFooter }}>
              <span style={{ color: COLORS.accent, fontWeight: 600 }}>Type</span>
              lite
            </div>
          </div>
        )}
      </div>
    );
  },
);

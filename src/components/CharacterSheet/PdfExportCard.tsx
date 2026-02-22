import { forwardRef } from "react";
import type { Character } from "../../engine/types/index.ts";
import { COLORS, FONT_FAMILY, dividerStyle } from "./exportStyles.ts";
import { PdfHeader } from "./pdf/PdfHeader.tsx";
import { PdfStats } from "./pdf/PdfStats.tsx";
import { PdfArchetype } from "./pdf/PdfArchetype.tsx";
import { PdfAbilities } from "./pdf/PdfAbilities.tsx";
import { PdfCombat } from "./pdf/PdfCombat.tsx";
import { PdfReport } from "./pdf/PdfReport.tsx";

// ============================================================
// PROPS
// ============================================================

interface PdfExportCardProps {
  character: Character;
  characterName: string;
  report: string | null;
  backstory: string | null;
}

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
          <PdfHeader
            characterName={characterName}
            title={character.title}
            activeSystems={character.activeSystems}
          />
          <div style={dividerStyle} />
          <PdfStats stats={character.stats} />
          <div style={dividerStyle} />
          <PdfArchetype archetype={character.archetype} />
          <div style={dividerStyle} />
          <PdfAbilities
            abilities={character.abilities}
            stats={character.stats}
          />
          {character.abilities.length > 0 && <div style={dividerStyle} />}
          <PdfCombat
            element={character.element}
            combatBehavior={character.combatBehavior}
          />
        </div>

        {/* Page 2+: Report & Backstory */}
        <PdfReport report={report} backstory={backstory} />

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

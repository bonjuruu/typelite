import { COLORS, sectionLabelStyle, dividerStyle } from "../exportStyles.ts";

interface PdfReportProps {
  report: string | null;
  backstory: string | null;
}

export function PdfReport({ report, backstory }: PdfReportProps) {
  if (!report && !backstory) return null;

  return (
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
  );
}

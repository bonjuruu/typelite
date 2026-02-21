import type { TypologySource } from "../../engine/types/index.ts";
import type { ComparisonSlot } from "../../types/comparison.ts";

// ============================================================
// HELPERS
// ============================================================

function formatTypologySource(source: TypologySource): string[] {
  const tagList: string[] = [];
  if (source.attitudinal) tagList.push(source.attitudinal);
  if (source.enneagram) {
    let label = `${source.enneagram.type}w${source.enneagram.wing} ${source.enneagram.instinct}`;
    if (source.enneagram.tritype)
      label += ` ${source.enneagram.tritype.join("-")}`;
    tagList.push(label);
  }
  if (source.mbti) tagList.push(source.mbti);
  if (source.socionics) tagList.push(source.socionics);
  if (source.instincts) {
    let label = source.instincts.realm;
    if (source.instincts.tritype)
      label += ` ${source.instincts.tritype.join("/")}`;
    tagList.push(label);
  }
  return tagList;
}

// ============================================================
// TYPOLOGY SOURCES
// ============================================================

interface TypologySourcesProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
}

export function TypologySources({ slotA, slotB }: TypologySourcesProps) {
  const tagsA = formatTypologySource(slotA.character.typologySource);
  const tagsB = formatTypologySource(slotB.character.typologySource);

  if (tagsA.length === 0 && tagsB.length === 0) return null;

  return (
    <div className="flex items-start justify-between gap-4 border-t border-gray-800 px-5 py-2.5">
      <div className="flex flex-wrap gap-1">
        {tagsA.map((tag) => (
          <span
            key={tag}
            className="rounded bg-indigo-950/30 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300/80"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="shrink-0 self-center text-[9px] font-bold uppercase text-gray-700">
        Types
      </span>
      <div className="flex flex-wrap justify-end gap-1">
        {tagsB.map((tag) => (
          <span
            key={tag}
            className="rounded bg-amber-950/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-300/80"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

import { useState, useRef, useMemo } from "react";
import type { Character, CharacterEdits } from "../../engine/types/index.ts";
import { generateCharacterSummary } from "../../engine/summarizer.ts";
import { CharacterSheetHeader } from "./CharacterSheetHeader.tsx";
import { StatsSection } from "./StatsSection.tsx";
import { ArchetypeSection } from "./ArchetypeSection.tsx";
import { AbilitiesSection } from "./AbilitiesSection.tsx";
import { ElementSection } from "./ElementSection.tsx";
import { CombatSection } from "./CombatSection.tsx";
import { ShareCard } from "./ShareCard.tsx";
import { PdfExportCard } from "./PdfExportCard.tsx";
import { BackstorySection } from "./BackstorySection.tsx";
import { ReportSection } from "./ReportSection.tsx";
import { InsightsSection } from "./InsightsSection.tsx";

// ============================================================
// PROPS
// ============================================================

interface CharacterSheetProps {
  character: Character;
  rawCharacter: Character | null;
  characterEdits: CharacterEdits;
  characterName: string;
  onSetCharacterName: (name: string) => void;
  onRegenerateName: () => void;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
  onResetEdits: () => void;
  onCompare?: () => void;
  comparisonSlotState?: "empty" | "a-filled" | "both-filled";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function CharacterSheet({
  character,
  rawCharacter,
  characterEdits,
  characterName,
  onSetCharacterName,
  onRegenerateName,
  onUpdateEdit,
  onResetEdits,
  onCompare,
  comparisonSlotState = "empty",
}: CharacterSheetProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const pdfCardRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [backstory, setBackstory] = useState<string | null>(null);
  const summary = useMemo(
    () =>
      character.activeSystems.length >= 2
        ? generateCharacterSummary(character)
        : null,
    [character],
  );
  const hasEdits =
    characterEdits.stats !== null ||
    characterEdits.className !== null ||
    characterEdits.abilityNameList !== null ||
    characterEdits.element !== null ||
    characterEdits.combatOrientation !== null;

  return (
    <div className="space-y-6">
      <CharacterSheetHeader
        character={character}
        characterName={characterName}
        onSetCharacterName={onSetCharacterName}
        onRegenerateName={onRegenerateName}
        shareCardRef={shareCardRef}
        pdfCardRef={pdfCardRef}
        editMode={editMode}
        onToggleEditMode={() => setEditMode((prev) => !prev)}
        hasEdits={hasEdits}
        onResetEdits={onResetEdits}
        onCompare={onCompare}
        comparisonSlotState={comparisonSlotState}
      />
      {summary && (
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
          <p className="text-sm leading-relaxed text-gray-300">{summary}</p>
        </div>
      )}
      <InsightsSection character={character} />
      <StatsSection
        character={character}
        rawCharacter={rawCharacter}
        editMode={editMode}
        characterEdits={characterEdits}
        onUpdateEdit={onUpdateEdit}
      />
      <ArchetypeSection
        character={character}
        editMode={editMode}
        characterEdits={characterEdits}
        onUpdateEdit={onUpdateEdit}
      />
      {character.abilities.length > 0 && (
        <AbilitiesSection
          character={character}
          editMode={editMode}
          characterEdits={characterEdits}
          onUpdateEdit={onUpdateEdit}
        />
      )}
      <ElementSection
        character={character}
        editMode={editMode}
        characterEdits={characterEdits}
        onUpdateEdit={onUpdateEdit}
      />
      <CombatSection
        character={character}
        editMode={editMode}
        characterEdits={characterEdits}
        onUpdateEdit={onUpdateEdit}
      />
      <ReportSection
        character={character}
        characterName={characterName}
        report={report}
        onSetReport={setReport}
      />
      <BackstorySection
        character={character}
        characterName={characterName}
        backstory={backstory}
        onSetBackstory={setBackstory}
      />

      {/* Hidden cards for export */}
      <ShareCard
        ref={shareCardRef}
        character={character}
        characterName={characterName}
      />
      <PdfExportCard
        ref={pdfCardRef}
        character={character}
        characterName={characterName}
        report={report}
        backstory={backstory}
      />
    </div>
  );
}

import { useState } from "react";
import type { Character, SystemId } from "../../engine/types/index.ts";
import { SYSTEM_META_LIST } from "../Builder/systemMeta.ts";
import { CopyGroup } from "./CopyGroup.tsx";
import { DownloadMenu } from "./DownloadMenu.tsx";

const SYSTEM_DISPLAY_NAME: Record<SystemId, string> = Object.fromEntries(
  SYSTEM_META_LIST.map((meta) => [meta.id, meta.name]),
) as Record<SystemId, string>;

// ============================================================
// HEADER
// ============================================================

interface CharacterSheetHeaderProps {
  character: Character;
  characterName: string;
  onSetCharacterName: (name: string) => void;
  onRegenerateName: () => void;
  shareCardRef: React.RefObject<HTMLDivElement | null>;
  pdfCardRef: React.RefObject<HTMLDivElement | null>;
  editMode: boolean;
  onToggleEditMode: () => void;
  hasEdits: boolean;
  onResetEdits: () => void;
  onCompare?: () => void;
  comparisonSlotState?: "empty" | "a-filled" | "both-filled";
}

const COMPARE_LABEL: Record<string, string> = {
  empty: "Compare Builds",
  "a-filled": "Compare (A saved)",
  "both-filled": "Compare (A+B ready)",
};

export function CharacterSheetHeader({
  character,
  characterName,
  onSetCharacterName,
  onRegenerateName,
  shareCardRef,
  pdfCardRef,
  editMode,
  onToggleEditMode,
  hasEdits,
  onResetEdits,
  onCompare,
  comparisonSlotState = "empty",
}: CharacterSheetHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const startEditing = () => {
    setEditValue(characterName);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const sanitized = editValue.trim().slice(0, 50).replace(/[<>]/g, "");
    if (sanitized) {
      onSetCharacterName(sanitized);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-700 pb-4">
      {/* Tier 1: Identity */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            aria-label="Character name"
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            onBlur={saveEdit}
            className="rounded border border-indigo-500 bg-gray-800 px-2 py-1 text-2xl font-bold text-gray-100 focus:outline-none sm:text-3xl"
          />
        ) : (
          <h2
            onClick={startEditing}
            className="cursor-pointer text-2xl font-bold text-gray-100 hover:text-indigo-300 sm:text-3xl"
            title="Click to edit name"
          >
            {characterName}
          </h2>
        )}
        <button
          onClick={onRegenerateName}
          className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
          title="Reroll name"
          aria-label="Reroll name"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.28a.75.75 0 0 0-.75.75v3.955a.75.75 0 0 0 1.5 0v-2.134l.246.245A7 7 0 0 0 17 11.424a.75.75 0 0 0-1.688 0Zm-10.55-2.849a.75.75 0 0 0 1.688 0 5.5 5.5 0 0 1 9.201-2.466l.312.311H13.53a.75.75 0 0 0 0 1.5h3.952a.75.75 0 0 0 .75-.75V3.214a.75.75 0 0 0-1.5 0v2.134l-.246-.245A7 7 0 0 0 3 8.575Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p className="text-lg text-indigo-400">{character.title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {character.activeSystems.map((systemId) => (
          <span
            key={systemId}
            className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300"
          >
            {SYSTEM_DISPLAY_NAME[systemId]}
          </span>
        ))}
      </div>

      {/* Tier 2: Build actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleEditMode}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${editMode ? "bg-indigo-600 text-white hover:bg-indigo-500" : "border border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800 hover:text-gray-100"}`}
          aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
          </svg>
          {editMode ? "Editing Build" : "Edit Build"}
        </button>
        {hasEdits && (
          <button
            onClick={onResetEdits}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-700/50 px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:border-amber-600 hover:bg-amber-950/20"
            aria-label="Reset all edits"
          >
            Reset Edits
          </button>
        )}
        {onCompare && (
          <button
            onClick={onCompare}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-800 hover:text-gray-100"
            aria-label="Save character for comparison"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M1 8.849c0 1.612.832 3.11 2.164 3.977a4.876 4.876 0 0 0 2.723.874C7.338 13.722 8.5 12.719 8.5 11.5V8.857a1 1 0 0 0-.334-.745A4.876 4.876 0 0 0 5.5 7.09c-.665.043-1.312.2-1.91.46L2.674 8.05A1.05 1.05 0 0 0 1 8.849ZM7.5 8.849c0 1.612.832 3.11 2.164 3.977a4.876 4.876 0 0 0 2.723.874c1.451.022 2.613-1.002 2.613-2.2V8.857a1 1 0 0 0-.334-.745A4.876 4.876 0 0 0 12 7.09c-.665.043-1.312.2-1.91.46L9.174 8.05A1.05 1.05 0 0 0 7.5 8.849Z" />
            </svg>
            {COMPARE_LABEL[comparisonSlotState]}
          </button>
        )}
      </div>

      {/* Tier 3: Share/export */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CopyGroup
          character={character}
          characterName={characterName}
          shareCardRef={shareCardRef}
        />
        <DownloadMenu
          characterName={characterName}
          shareCardRef={shareCardRef}
          pdfCardRef={pdfCardRef}
        />
      </div>
    </div>
  );
}

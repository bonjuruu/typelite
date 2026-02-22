import { useState, useEffect, useCallback, useRef } from "react";
import { useCharacterGenerator } from "./hooks/useCharacterGenerator.ts";
import { useComparison } from "./hooks/useComparison.ts";
import { BuilderPanel } from "./components/Builder/BuilderPanel.tsx";
import { CharacterSheet } from "./components/CharacterSheet/CharacterSheet.tsx";
import { ComparisonView } from "./components/Comparison/ComparisonView.tsx";
import { QuizFlow } from "./components/Quiz/QuizFlow.tsx";
import { AboutModal } from "./components/common/AboutModal.tsx";
import { Footer } from "./components/common/Footer.tsx";
import { AboutPage } from "./components/About/AboutPage.tsx";
import type { QuizResult } from "./data/quiz/types.ts";

type AppMode = "builder" | "quiz" | "about";

function App() {
  const [mode, setMode] = useState<AppMode>("builder");
  const [showAbout, setShowAbout] = useState(false);
  const [builderExpanded, setBuilderExpanded] = useState(true);
  const comparison = useComparison();
  const comparisonRef = useRef<HTMLDivElement>(null);

  const {
    enabledSystems,
    selections,
    overrides,
    character,
    characterName,
    generateCount,
    hasAllSelections,
    toggleSystem,
    updateSelection,
    updateOverride,
    setEnneagramType,
    randomizeSystem,
    randomizeAll,
    generate,
    setCharacterName,
    regenerateName,
    loadFromUrl,
    applyQuizResults,
    rawCharacter,
    characterEdits,
    updateCharacterEdit,
    resetCharacterEdits,
  } = useCharacterGenerator();

  useEffect(() => {
    loadFromUrl();
  }, [loadFromUrl]);

  const handleGenerate = useCallback(() => {
    generate();
    setBuilderExpanded(false);
  }, [generate]);

  const handleQuizComplete = (result: QuizResult) => {
    applyQuizResults(result);
    setMode("builder");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-indigo-400">Type</span>lite
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("about")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "about"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setMode("quiz")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "quiz"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setMode("builder")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "builder"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              Builder
            </button>
          </div>
        </div>
      </header>

      {mode === "about" ? (
        <main className="mx-auto max-w-3xl flex-1 p-4 sm:p-6">
          <AboutPage onOpenSystemDetails={() => setShowAbout(true)} />
        </main>
      ) : mode === "quiz" ? (
        <main className="mx-auto max-w-3xl flex-1 p-4 sm:p-6">
          <QuizFlow
            enabledSystems={enabledSystems}
            onComplete={handleQuizComplete}
            onCancel={() => setMode("builder")}
          />
        </main>
      ) : (
        <main className="mx-auto max-w-5xl flex-1 space-y-6 p-4 sm:p-6">
          {!character && (
            <WelcomePanel
              onStartQuiz={() => setMode("quiz")}
              onOpenAbout={() => setShowAbout(true)}
            />
          )}

          <BuilderPanel
            enabledSystems={enabledSystems}
            selections={selections}
            overrides={overrides}
            hasAllSelections={hasAllSelections}
            isExpanded={builderExpanded}
            compact={generateCount > 0}
            onSetExpanded={setBuilderExpanded}
            onToggleSystem={toggleSystem}
            onUpdateSelection={updateSelection}
            onUpdateOverride={updateOverride}
            onSetEnneagramType={setEnneagramType}
            onRandomizeSystem={randomizeSystem}
            onRandomizeAll={randomizeAll}
            onGenerate={handleGenerate}
          />

          {(comparison.slotA || comparison.slotB) && (
            <div ref={comparisonRef}>
              <ComparisonView
                slotA={comparison.slotA}
                slotB={comparison.slotB}
                diff={comparison.diff}
                onClearSlot={comparison.clearSlot}
                onClearAll={comparison.clearAll}
              />
            </div>
          )}

          {character && (
            <div
              key={generateCount}
              className="animate-[fade-in-up_0.4s_ease-out]"
            >
              <CharacterSheet
                character={character}
                rawCharacter={rawCharacter}
                characterEdits={characterEdits}
                characterName={characterName}
                onSetCharacterName={setCharacterName}
                onRegenerateName={regenerateName}
                onUpdateEdit={updateCharacterEdit}
                onResetEdits={resetCharacterEdits}
                onCompare={() => {
                  comparison.saveToNextSlot(character, characterName);
                  setTimeout(
                    () =>
                      comparisonRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      }),
                    50,
                  );
                }}
                comparisonSlotState={
                  comparison.slotA && comparison.slotB
                    ? "both-filled"
                    : comparison.slotA
                      ? "a-filled"
                      : "empty"
                }
              />
            </div>
          )}
        </main>
      )}

      <Footer />
      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

// ============================================================
// WELCOME PANEL (empty state for first-time visitors)
// ============================================================

const SYSTEM_PREVIEW_LIST = [
  {
    name: "Attitudinal Psyche",
    domain: "Stats",
    desc: "Ranks 4 aspects to set your base stat spread",
  },
  {
    name: "Enneagram",
    domain: "Class",
    desc: "9 core egos become class archetypes with wings and growth lines",
  },
  {
    name: "Jungian Type",
    domain: "Abilities",
    desc: "4-function cognitive stack produces 4 unique abilities",
  },
  {
    name: "Socionics",
    domain: "Element",
    desc: "Quadra determines elemental school, club grants a passive trait",
  },
  {
    name: "Expanded Instincts",
    domain: "Combat",
    desc: "9 instincts that expands the enneagram instincts shape combat behavior",
  },
] as const;

function WelcomePanel({
  onStartQuiz,
  onOpenAbout,
}: {
  onStartQuiz: () => void;
  onOpenAbout: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-100">What is this?</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          Typelite generates roguelite-style game characters from{" "}
          <em className="text-gray-300">typology systems</em>. The five systems
          each measure something different about how people think and act. They
          layer together to produce stats, a class, abilities, an element, and
          combat behavior. Your real personality creates a character that
          actually plays differently.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Don't know your types? The{" "}
          <button
            onClick={onStartQuiz}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Quiz
          </button>{" "}
          will determine them. Already know them? Pick from the selectors below
          and hit Generate.
        </p>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5 sm:p-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          5 systems, 5 domains
        </h3>
        <div className="space-y-2.5">
          {SYSTEM_PREVIEW_LIST.map((system) => (
            <div
              key={system.name}
              className="flex items-baseline gap-2 text-sm"
            >
              <span className="shrink-0 font-medium text-gray-200">
                {system.name}
              </span>
              <span className="shrink-0 text-xs text-indigo-400">
                &rarr; {system.domain}
              </span>
              <span className="text-xs text-gray-600">- {system.desc}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onOpenAbout}
          className="mt-4 text-xs font-medium text-gray-500 transition-colors hover:text-gray-300"
        >
          Why these systems? &rarr;
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStartQuiz}
          className="flex-1 rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
        >
          Take the Quiz
        </button>
        <span className="flex items-center text-xs text-gray-600">
          or pick types below
        </span>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react'
import { useCharacterGenerator } from './hooks/useCharacterGenerator.ts'
import { BuilderPanel } from './components/Builder/BuilderPanel.tsx'
import { CharacterSheet } from './components/CharacterSheet/CharacterSheet.tsx'
import { QuizFlow } from './components/Quiz/QuizFlow.tsx'
import { AboutModal } from './components/common/AboutModal.tsx'
import { AboutPage } from './components/About/AboutPage.tsx'
import type { QuizResult } from './data/quiz/types.ts'

type AppMode = 'builder' | 'quiz' | 'about'

function App() {
  const [mode, setMode] = useState<AppMode>('builder')
  const [showAbout, setShowAbout] = useState(false)

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
  } = useCharacterGenerator()

  useEffect(() => {
    loadFromUrl()
  }, [loadFromUrl])

  const handleQuizComplete = (result: QuizResult) => {
    applyQuizResults(result)
    setMode('builder')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-indigo-400">Type</span>lite
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('about')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'about'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'quiz'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setMode('builder')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'builder'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              Builder
            </button>
          </div>
        </div>
      </header>

      {mode === 'about' ? (
        <main className="mx-auto max-w-3xl p-4 sm:p-6">
          <AboutPage onOpenSystemDetails={() => setShowAbout(true)} />
        </main>
      ) : mode === 'quiz' ? (
        <main className="mx-auto max-w-3xl p-4 sm:p-6">
          <QuizFlow
            enabledSystems={enabledSystems}
            onComplete={handleQuizComplete}
            onCancel={() => setMode('builder')}
          />
        </main>
      ) : (
        <main className="mx-auto grid max-w-6xl gap-6 p-4 sm:gap-8 sm:p-6 lg:grid-cols-2">
          <BuilderPanel
            enabledSystems={enabledSystems}
            selections={selections}
            overrides={overrides}
            hasAllSelections={hasAllSelections}
            onToggleSystem={toggleSystem}
            onUpdateSelection={updateSelection}
            onUpdateOverride={updateOverride}
            onSetEnneagramType={setEnneagramType}
            onRandomizeSystem={randomizeSystem}
            onRandomizeAll={randomizeAll}
            onGenerate={generate}
          />

          <div>
            {character ? (
              <div key={generateCount} className="animate-[fade-in-up_0.4s_ease-out]">
                <CharacterSheet
                  character={character}
                  characterName={characterName}
                  onSetCharacterName={setCharacterName}
                  onRegenerateName={regenerateName}
                />
              </div>
            ) : (
              <WelcomePanel onStartQuiz={() => setMode('quiz')} onOpenAbout={() => setShowAbout(true)} />
            )}
          </div>
        </main>
      )}

      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  )
}

// ============================================================
// WELCOME PANEL (empty state for first-time visitors)
// ============================================================

const SYSTEM_PREVIEW_LIST = [
  { name: 'Attitudinal Psyche', domain: 'Stats', desc: 'Ranks 4 cognitive aspects to set your base stat spread' },
  { name: 'Enneagram', domain: 'Class', desc: '9 core motivations become class archetypes with wings and growth lines' },
  { name: 'MBTI (Beebe)', domain: 'Abilities', desc: '4-function cognitive stack produces 4 unique abilities' },
  { name: 'Socionics', domain: 'Element', desc: 'Quadra determines elemental school, club grants a passive trait' },
  { name: 'Expanded Instincts', domain: 'Combat', desc: '9 realms with 3 triad systems shape combat behavior' },
] as const

function WelcomePanel({ onStartQuiz, onOpenAbout }: { onStartQuiz: () => void; onOpenAbout: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-100">What is this?</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          Typelite generates roguelite-style game characters from <em className="text-gray-300">real personality typology</em>.
          Five systems — each measuring something genuinely different about how people think and
          act — layer together to produce stats, a class, abilities, an element, and combat behavior.
          Your real personality creates a character that actually plays differently.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Don't know your types? The <button onClick={onStartQuiz} className="font-medium text-indigo-400 hover:text-indigo-300">Quiz</button> will
          determine them. Already know them? Pick from the selectors on the left and hit Generate.
        </p>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5 sm:p-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">5 systems, 5 domains</h3>
        <div className="space-y-2.5">
          {SYSTEM_PREVIEW_LIST.map((system) => (
            <div key={system.name} className="flex items-baseline gap-2 text-sm">
              <span className="shrink-0 font-medium text-gray-200">{system.name}</span>
              <span className="shrink-0 text-xs text-indigo-400">&rarr; {system.domain}</span>
              <span className="text-xs text-gray-600">&mdash; {system.desc}</span>
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
        <span className="flex items-center text-xs text-gray-600">or pick types on the left</span>
      </div>
    </div>
  )
}

export default App

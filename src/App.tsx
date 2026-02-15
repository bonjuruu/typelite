import { useEffect } from 'react'
import { useCharacterGenerator } from './hooks/useCharacterGenerator.ts'
import { BuilderPanel } from './components/Builder/BuilderPanel.tsx'
import { CharacterSheet } from './components/CharacterSheet/CharacterSheet.tsx'

function App() {
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
  } = useCharacterGenerator()

  useEffect(() => {
    loadFromUrl()
  }, [loadFromUrl])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-indigo-400">Type</span>lite
        </h1>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-2">
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
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-12">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mb-4 h-16 w-16 text-gray-800">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-semibold text-gray-500">No Character Yet</p>
              <p className="mt-1 text-sm text-gray-600">
                Select your types and hit Generate to create a character.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

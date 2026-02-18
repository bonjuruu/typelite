import { useState } from 'react'
import type { Character } from '../../engine/types.ts'
import { generateBackstory } from '../../utils/backstoryApi.ts'
import { SectionTitle } from '../common/SectionTitle.tsx'

// ============================================================
// PROPS
// ============================================================

interface BackstorySectionProps {
  character: Character
  characterName: string
}

// ============================================================
// COMPONENT
// ============================================================

export function BackstorySection({ character, characterName }: BackstorySectionProps) {
  const [backstory, setBackstory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await generateBackstory(character, characterName)
      setBackstory(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate backstory')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>Backstory</SectionTitle>

      {backstory ? (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="whitespace-pre-line text-sm leading-relaxed text-gray-300">
            {backstory}
          </div>
          <button
            onClick={() => void handleGenerate()}
            disabled={isLoading}
            className="mt-4 rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center">
          {error && (
            <p className="mb-3 text-sm text-red-400">{error}</p>
          )}
          <p className="mb-4 text-sm text-gray-500">
            Generate a dark fantasy backstory for {characterName} using AI.
          </p>
          <button
            onClick={() => void handleGenerate()}
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Backstory'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type { Character } from '../../engine/types.ts'
import { generateReport } from '../../utils/backstoryApi.ts'
import { SectionTitle } from '../common/SectionTitle.tsx'

// ============================================================
// PROPS
// ============================================================

interface ReportSectionProps {
  character: Character
  characterName: string
}

// ============================================================
// COMPONENT
// ============================================================

export function ReportSection({ character, characterName }: ReportSectionProps) {
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await generateReport(character, characterName)
      setReport(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsLoading(false)
    }
  }

  const systemCount = character.activeSystems.length

  return (
    <div>
      <SectionTitle>Typology Report</SectionTitle>

      {report ? (
        <div className="rounded-lg border border-indigo-800/50 bg-gradient-to-b from-indigo-950/20 to-gray-800 p-5">
          <div className="whitespace-pre-line text-sm leading-relaxed text-gray-300">
            {report}
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
        <div className="rounded-lg border border-indigo-800/50 bg-gradient-to-b from-indigo-950/30 to-gray-900 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 ring-1 ring-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-indigo-400">
                <path d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 13.828a.75.75 0 0 1 0 1.061l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM12.828 13.828a.75.75 0 0 1 1.061 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM10 14a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 14Z" />
                <path fillRule="evenodd" d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-100">How do {characterName}&apos;s systems interact?</h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                {systemCount >= 3
                  ? `With ${systemCount} active systems, there are real interactions worth exploring — how the AP stack shapes ability scaling, why the enneagram class plays differently with this element, and what combat patterns emerge from the full build.`
                  : `Generate a deep-dive into how ${characterName}'s typology shapes their stats, abilities, and combat identity.`
                }
              </p>
              {error && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
              <button
                onClick={() => void handleGenerate()}
                disabled={isLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Generate Typology Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

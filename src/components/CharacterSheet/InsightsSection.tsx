import type { Character } from '../../engine/types.ts'
import { generateSystemInsights } from '../../engine/insights.ts'
import { SectionTitle } from '../common/SectionTitle.tsx'

interface InsightsSectionProps {
  character: Character
}

export function InsightsSection({ character }: InsightsSectionProps) {
  const insightList = generateSystemInsights(character)

  if (insightList.length === 0) return null

  return (
    <div>
      <SectionTitle>System Interactions</SectionTitle>
      <div className="rounded-lg border border-indigo-800/40 bg-indigo-950/20 p-4">
        <ul className="space-y-2">
          {insightList.map((insight, index) => (
            <li key={index} className="flex gap-2 text-sm text-gray-300">
              <span className="mt-0.5 text-indigo-400">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

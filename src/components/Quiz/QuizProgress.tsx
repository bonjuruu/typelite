import type { QuizSystemId } from '../../data/quiz/types.ts'

// ============================================================
// SYSTEM LABELS
// ============================================================

const SYSTEM_SHORT_LABEL: Record<QuizSystemId, string> = {
  attitudinal: 'AP',
  enneagram: 'Enneagram',
  mbti: 'MBTI',
  socionics: 'Socionics',
  instincts: 'Instincts',
}

// ============================================================
// PROPS
// ============================================================

interface QuizProgressProps {
  currentIndex: number
  totalCount: number
  currentSystem: QuizSystemId | null
}

// ============================================================
// COMPONENT
// ============================================================

export function QuizProgress({ currentIndex, totalCount, currentSystem }: QuizProgressProps) {
  const fraction = totalCount > 0 ? Math.min(currentIndex / totalCount, 1) : 0

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
        <span>
          {currentIndex + 1} / {totalCount}
          {currentSystem && (
            <span className="ml-2 text-gray-500">
              — {SYSTEM_SHORT_LABEL[currentSystem]}
            </span>
          )}
        </span>
        <span>{Math.round(fraction * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}

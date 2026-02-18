import { useState, useEffect, useCallback } from 'react'
import type { QuizQuestion as QuizQuestionType } from '../../data/quiz/types.ts'

// ============================================================
// PROPS
// ============================================================

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedIndex: number | undefined
  onSelectOption: (optionIndex: number) => void
}

// ============================================================
// COMPONENT
// ============================================================

export function QuizQuestion({ question, selectedIndex, onSelectOption }: QuizQuestionProps) {
  const [justSelected, setJustSelected] = useState<number | null>(null)

  const handleSelect = useCallback((index: number) => {
    setJustSelected(index)
    // Auto-advance after brief visual feedback
    setTimeout(() => {
      onSelectOption(index)
      setJustSelected(null)
    }, 300)
  }, [onSelectOption])

  // Keyboard navigation: 1-4 to select options
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (justSelected !== null) return
      const index = parseInt(e.key) - 1
      if (index >= 0 && index < question.optionList.length) {
        handleSelect(index)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [question, justSelected, handleSelect])

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-8 text-lg leading-relaxed text-gray-200">
        {question.prompt}
      </p>

      <div className="space-y-3">
        {question.optionList.map((option, index) => {
          const isSelected = justSelected === index || (justSelected === null && selectedIndex === index)

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={justSelected !== null}
              className={`w-full rounded-lg border px-4 py-3 text-left text-base transition-all sm:px-5 sm:py-4 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
              } ${justSelected !== null && justSelected !== index ? 'opacity-40' : ''}`}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded border border-gray-600 text-[10px] text-gray-500">
                {index + 1}
              </span>
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

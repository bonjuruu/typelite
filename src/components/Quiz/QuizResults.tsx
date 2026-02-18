import type { QuizResult, QuizMode } from '../../data/quiz/types.ts'
import type { ScoreBreakdown } from '../../engine/quiz/scorer.ts'
import type { EnabledSystems } from '../../hooks/useCharacterGenerator.ts'
import type { CognitiveFunction } from '../../engine/types.ts'
import { getEnneagramType, getInstinctLabel, getInstinctFullName, describeStack, getSocionicsType } from '../../hooks/useCharacterGenerator.ts'
import { getRealmName, getInstinctRealm } from '../../data/instincts.ts'
import { getFunctionStack, getCognitiveFunctionName } from '../../data/mbti.ts'

// ============================================================
// PROPS
// ============================================================

interface QuizResultsProps {
  result: QuizResult
  enabledSystems: EnabledSystems
  quizMode: QuizMode
  onGenerateCharacter: () => void
  onRetake: () => void
}

// ============================================================
// COMPONENT
// ============================================================

export function QuizResults({ result, enabledSystems, quizMode, onGenerateCharacter, onRetake }: QuizResultsProps) {
  return (
    <div className="mx-auto max-w-lg animate-[fade-in-up_0.4s_ease-out]">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-100">
        Your Types Have Been Revealed
      </h2>

      <div className="mb-8 space-y-3">
        {enabledSystems.attitudinal && result.attitudinal && (
          <ResultCard
            label="Attitudinal Psyche"
            domain="Base Stats"
            value={result.attitudinal}
            description={describeAP(result.attitudinal)}
            explanation={result.explanationMap?.attitudinal}
          />
        )}

        {enabledSystems.enneagram && result.enneagramType && (
          <ResultCard
            label="Enneagram"
            domain="Class"
            value={formatEnneagram(result)}
            description={describeEnneagram(result)}
            explanation={result.explanationMap?.enneagram}
          />
        )}

        {enabledSystems.mbti && result.mbti && (
          <ResultCard
            label="MBTI"
            domain="Abilities"
            value={result.mbti}
            description={describeMBTI(result.mbti)}
            explanation={result.explanationMap?.mbti}
            methodNote={quizMode === 'deep' ? 'Function-based' : 'Dichotomy-based'}
          >
            {quizMode === 'deep' && result.deepDetail?.cognitiveFunctionScoreMap && (
              <CognitiveFunctionRanking scoreMap={result.deepDetail.cognitiveFunctionScoreMap} />
            )}
          </ResultCard>
        )}

        {enabledSystems.socionics && result.socionics && (
          <ResultCard
            label="Socionics"
            domain="Element"
            value={result.socionics}
            description={describeSocionics(result.socionics)}
            explanation={result.explanationMap?.socionics}
            methodNote={quizMode === 'deep' ? 'Independent' : 'Derived from MBTI'}
          />
        )}

        {enabledSystems.instincts && result.instinctRealm && (
          <ResultCard
            label="Expanded Instincts"
            domain="Combat"
            value={`${result.instinctRealm} — ${getRealmName(result.instinctRealm)}`}
            description={describeInstincts(result.instinctRealm)}
            explanation={result.explanationMap?.instincts}
          />
        )}
      </div>

      <p className="mb-6 text-center text-sm text-gray-500">
        These results will populate the builder where you can adjust before generating.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onGenerateCharacter}
          className="flex-1 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500"
        >
          Generate Character
        </button>
        <button
          onClick={onRetake}
          className="rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
        >
          Retake
        </button>
      </div>
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function ResultCard({ label, domain, value, description, explanation, methodNote, children }: {
  label: string
  domain: string
  value: string
  description: string
  explanation?: ScoreBreakdown
  methodNote?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <span className="rounded-full bg-indigo-600/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
          &rarr; {domain}
        </span>
        {methodNote && (
          <span className="rounded-full bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-400">
            {methodNote}
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-gray-100">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
      {children}
      {explanation && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase text-indigo-500">
            Why this type?
          </summary>
          <div className="mt-2 space-y-2 text-xs text-gray-500">
            <p>{explanation.axisLeanSummary.join(' ')}</p>
            <ul className="space-y-1">
              {explanation.scoreDetail.map((detail, index) => (
                <li key={index} className="flex gap-1.5">
                  <span className="text-gray-600">&bull;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </div>
  )
}

function CognitiveFunctionRanking({ scoreMap }: { scoreMap: Record<CognitiveFunction, number> }) {
  const sortedFunctionList = (Object.entries(scoreMap) as [CognitiveFunction, number][])
    .sort((a, b) => b[1] - a[1])

  const maxScore = sortedFunctionList[0]?.[1] ?? 1

  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cognitive Function Scores</p>
      {sortedFunctionList.map(([fn, score]) => (
        <div key={fn} className="flex items-center gap-2 text-xs">
          <span className="w-6 font-mono font-medium text-gray-300">{fn}</span>
          <div className="h-1.5 flex-1 rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-500/60"
              style={{ width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%` }}
            />
          </div>
          <span className="w-6 text-right font-mono text-gray-500">{score}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// HELPERS
// ============================================================

function formatEnneagram(result: QuizResult): string {
  if (!result.enneagramType) return ''

  const typeData = getEnneagramType(result.enneagramType)
  const wingStr = result.enneagramWing ? `w${result.enneagramWing}` : ''
  const instinctStr = result.enneagramInstinct
    ? ` (${result.enneagramInstinct})`
    : ''

  return `${result.enneagramType}${wingStr}${instinctStr} — ${typeData.className}`
}

// ============================================================
// DESCRIPTION GENERATORS
// ============================================================

function describeAP(apType: string): string {
  const stack = describeStack(apType as import('../../engine/types.ts').APType)
  const first = stack[0]
  const fourth = stack[3]
  return `Your ${first.aspect} leads — ${first.flavor.summary} Your weakest aspect is ${fourth.aspect}, sitting in 4th where you defer to others. This sets your base stats: ${first.stat} highest (${first.statValue}), ${fourth.stat} lowest (${fourth.statValue}).`
}

function describeEnneagram(result: QuizResult): string {
  if (!result.enneagramType) return ''
  const typeData = getEnneagramType(result.enneagramType)
  const wingPart = result.enneagramWing
    ? ` The w${result.enneagramWing} wing shades you toward Type ${result.enneagramWing}'s qualities, blending 30% of its stat modifiers into your archetype.`
    : ''
  const instinctPart = result.enneagramInstinct
    ? ` As ${getInstinctFullName(result.enneagramInstinct)} (${result.enneagramInstinct}), you gain the "${getInstinctLabel(result.enneagramInstinct)}" passive.`
    : ''
  return `${typeData.name} becomes your ${typeData.className} class. ${typeData.description}${wingPart}${instinctPart}`
}

function describeMBTI(mbtiType: import('../../engine/types.ts').MBTIType): string {
  const stack = getFunctionStack(mbtiType)
  const heroName = getCognitiveFunctionName(stack[0])
  const inferiorName = getCognitiveFunctionName(stack[3])
  return `Your Hero function is ${heroName} (${stack[0]}) — your primary ability and strongest expression in combat. Your Inferior, ${inferiorName} (${stack[3]}), is normally weak but has a clutch comeback mechanic when you're under pressure. The full stack ${stack.join('-')} gives you four distinct abilities.`
}

function describeSocionics(socionicsType: import('../../engine/types.ts').SocionicsType): string {
  const typeData = getSocionicsType(socionicsType)
  return `${typeData.name} places you in the ${typeData.quadra} quadra, granting the ${typeData.element} element. Your ${typeData.club} club gives a passive trait that reflects your cognitive style. Note: Socionics types don't map 1-to-1 with MBTI — they're a separate system with different notation.`
}

function describeInstincts(realm: import('../../engine/types.ts').InstinctRealm): string {
  const realmData = getInstinctRealm(realm)
  const centerLabel = realmData.center === 'SUR' ? 'Self-Survival (Frontline)'
    : realmData.center === 'INT' ? 'Interpersonal (Support)'
    : 'Purpose (Strategist)'
  return `${realmData.name} sits in the ${centerLabel} center, setting your combat orientation. Your triads — ${realmData.experiential} activation, ${realmData.movement} positioning, ${realmData.source} regen — shape how you fight moment to moment. This is separate from classic enneagram sp/so/sx instincts.`
}

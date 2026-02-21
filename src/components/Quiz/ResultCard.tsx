import type { ScoreBreakdown } from "../../types/quiz.ts";
import { ScoreBarChart } from "./ScoreBarChart.tsx";
import { QuestionInfluenceList } from "./QuestionInfluenceList.tsx";

// ============================================================
// RESULT CARD
// ============================================================

interface ResultCardProps {
  label: string;
  domain: string;
  value: string;
  description: string;
  explanation?: ScoreBreakdown;
  methodNote?: string;
  children?: React.ReactNode;
}

export function ResultCard({
  label,
  domain,
  value,
  description,
  explanation,
  methodNote,
  children,
}: ResultCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
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
      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        {description}
      </p>
      {children}
      {explanation && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase text-indigo-500">
            Why this type?
          </summary>
          <div className="mt-2 space-y-2 text-xs text-gray-500">
            <p>{explanation.axisLeanSummary.join(" ")}</p>
            <ul className="space-y-1">
              {explanation.scoreDetail.map((detail, index) => (
                <li key={index} className="flex gap-1.5">
                  <span className="text-gray-600">&bull;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            {explanation.scoreEntryList &&
              explanation.scoreEntryList.length > 0 && (
                <ScoreBarChart
                  scoreEntryList={explanation.scoreEntryList}
                  winnerLabel={explanation.scoreEntryList[0]?.label}
                />
              )}
            {explanation.questionInfluenceList &&
              explanation.questionInfluenceList.length > 0 && (
                <QuestionInfluenceList
                  questionInfluenceList={explanation.questionInfluenceList}
                />
              )}
          </div>
        </details>
      )}
    </div>
  );
}

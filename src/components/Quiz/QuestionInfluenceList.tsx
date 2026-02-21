import type { QuestionInfluence } from "../../types/quiz.ts";

interface QuestionInfluenceListProps {
  questionInfluenceList: QuestionInfluence[];
}

export function QuestionInfluenceList({
  questionInfluenceList,
}: QuestionInfluenceListProps) {
  if (questionInfluenceList.length === 0) return null;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-xs font-semibold uppercase text-gray-600 hover:text-gray-500">
        How each question scored
      </summary>
      <div className="mt-2 space-y-2">
        {questionInfluenceList.map((influence) => (
          <div
            key={influence.questionId}
            className="rounded border border-gray-700/50 bg-gray-800/30 px-3 py-2 text-xs"
          >
            <p className="mb-1 text-gray-400">{influence.questionPrompt}</p>
            <p className="mb-1 font-medium text-gray-300">
              &rarr; {influence.selectedOptionLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {influence.contributionList.map((contrib) => (
                <span
                  key={contrib.target}
                  className="rounded-full bg-indigo-600/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400"
                >
                  {contrib.target} +{contrib.points}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

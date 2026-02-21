import type { CharacterDiff } from "../../types/comparison.ts";

// ============================================================
// PASSIVES
// ============================================================

interface PassivesContentProps {
  diff: CharacterDiff;
}

export function PassivesContent({ diff }: PassivesContentProps) {
  const { passiveDiff } = diff;

  return (
    <div className="space-y-2">
      {passiveDiff.sharedNameList.length > 0 && (
        <div>
          <span className="text-[9px] font-semibold uppercase text-gray-500">
            Shared
          </span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {passiveDiff.sharedNameList.map((name) => (
              <span
                key={name}
                className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
      {passiveDiff.uniqueToA.length > 0 && (
        <div>
          <span className="text-[9px] font-semibold uppercase text-gray-500">
            Unique to <span className="text-indigo-400/60">A</span>
          </span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {passiveDiff.uniqueToA.map((name) => (
              <span
                key={name}
                className="rounded bg-indigo-950/30 px-2 py-0.5 text-xs text-indigo-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
      {passiveDiff.uniqueToB.length > 0 && (
        <div>
          <span className="text-[9px] font-semibold uppercase text-gray-500">
            Unique to <span className="text-amber-400/60">B</span>
          </span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {passiveDiff.uniqueToB.map((name) => (
              <span
                key={name}
                className="rounded bg-amber-950/30 px-2 py-0.5 text-xs text-amber-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

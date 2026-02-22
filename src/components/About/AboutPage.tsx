// ============================================================
// PROPS
// ============================================================

interface AboutPageProps {
  onOpenSystemDetails: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function AboutPage({ onOpenSystemDetails }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-2xl animate-[fade-in-up_0.4s_ease-out] py-4">
      <h2 className="text-3xl font-bold tracking-tight text-gray-100">
        Why I Built This
      </h2>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-400">
        <p>
          I've had an on and off interest in typology for about a decade. You
          could say I love typology. The systems are genuinely fascinating to me
          because they help me understand people in a way I couldn't before. All
          these systems are a different layer of the human psyche and they've
          somehow helped my personal relationships. Typology can be a really
          useful tool when used correctly. I thought hey, it could also be
          really helpful for character design so I built Typelite.
        </p>

        <p>
          Most typology content focuses on one system at a time. Jungian type
          quizzes, enneagram wikis, forum debates about whether you're INFJ or
          INFP.
          They're interesting on their own but they never really talk to each
          other. I wanted to see what happens when you layer all five together
          and gamify it so it's less abstract and actually fun to share.
        </p>

        <p>
          Typelite turns five typology systems into a roguelite character
          builder. Your types become stats, a class, abilities, an element, and
          combat behavior.
        </p>

        <div className="rounded-lg border border-yellow-900/40 bg-yellow-950/20 px-4 py-3 text-xs text-yellow-200/60">
          Some definitions and descriptions are my own interpretations or
          simplifications to make the game mechanics work. If you want to go
          deeper, look into the original systems directly. And remember,
          typology works best as a tool for understanding people, not a box to
          put them in. Don't get too caught up in what's "correct."
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-800/30 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            The five systems
          </h3>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li>
              <span className="text-gray-300">Attitudinal Psyche</span> &rarr;
              Stats
            </li>
            <li>
              <span className="text-gray-300">Enneagram</span> &rarr; Class
              &amp; Archetype
            </li>
            <li>
              <span className="text-gray-300">Jungian Type</span> &rarr; Abilities
            </li>
            <li>
              <span className="text-gray-300">Socionics</span> &rarr; Element
            </li>
            <li>
              <span className="text-gray-300">Expanded Instincts</span> &rarr;
              Combat Behavior
            </li>
          </ul>
          <button
            onClick={onOpenSystemDetails}
            className="mt-3 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Why these systems specifically? &rarr;
          </button>
        </div>

        <p>
          You can toggle any combination of systems on or off. Use just the ones
          you know, or turn them all on and see what comes out.
        </p>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6">
        <p className="text-xs text-gray-600">
          Built with React, TypeScript, Tailwind, and an unreasonable amount of
          typology spreadsheets.
        </p>
      </div>
    </div>
  );
}

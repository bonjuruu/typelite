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
          I love typology. I think the systems are genuinely fascinating - the
          way cognitive functions stack in MBTI, how enneagram wings and growth
          lines create these layered portraits of motivation, how something like
          Attitudinal Psyche can describe why two people with the same "type"
          still feel completely different.
        </p>

        <p>
          But most typology content is just... reading. Wikis, charts, forum
          debates about whether you're INFJ or INFP. It's interesting, but it
          never felt like something I could{" "}
          <em className="text-gray-300">share</em> with people who aren't
          already into it. Telling someone "I'm a 5w4 sp/so with Ni-hero"
          doesn't land unless they already speak the language.
        </p>

        <p>
          So I wanted to build something fun. Something where you could show
          someone your types and they'd actually get it - not because they
          studied the theory, but because it turns into a character they can
          look at and go "oh, that's you."
        </p>

        <p>
          Typelite takes five typology systems and turns them into a roguelite
          character builder - your types become stats, a class, abilities, an
          element, and combat behavior. It's not meant to be a serious
          assessment tool. It's meant to be a fun way to see your types come to
          life as something visual and shareable.
        </p>

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
              <span className="text-gray-300">MBTI (Beebe model)</span> &rarr;
              Abilities
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
          You can toggle any combination of systems on or off - use just the
          ones you know, or turn them all on and see what comes out. The whole
          point is to make typology something you can play with and share, not
          just read about.
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

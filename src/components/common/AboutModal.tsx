import { useEffect, useRef } from 'react'

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 mx-auto my-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-0 text-gray-100 shadow-2xl backdrop:bg-black/60"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-100">About Typelite</h2>
            <p className="mt-1 text-sm text-gray-500">Why these systems, and why these mappings</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="mb-8 text-sm leading-relaxed text-gray-400">
          <p>
            Typelite turns real personality typology into a roguelite character builder. Five systems,
            each measuring something genuinely different about how people think and act, map onto five
            distinct game domains. The goal isn't just a character generator — it's a framework where
            your real personality produces a character that <em className="text-gray-300">actually plays differently</em>.
          </p>
        </div>

        <div className="space-y-6">
          <SystemEntry
            name="Attitudinal Psyche"
            arrow="Base Stats"
            what="Ranks four cognitive aspects — Volition, Logic, Emotion, Physics — from strongest to weakest. Each position has distinct attitudes: your 1st is confident and imposing, your 2nd is collaborative, your 3rd is insecure, and your 4th is accepting."
            why="The four aspects map naturally to four stat axes: V→Willpower, L→Intelligence, E→Spirit, F→Vitality. Position values (14/10/7/4) create real asymmetry — your character is shaped by where you're strong and where you defer, not just which box you checked."
          />

          <SystemEntry
            name="Enneagram"
            arrow="Class & Archetype"
            what="Describes 9 core motivations with adjacent wings that shade the type, instinctual variants (sp/so/sx) that add behavioral flavor, and lines of integration and disintegration that show how you shift under growth and stress."
            why="Enneagram types have rich identities that translate directly to class archetypes — the knowledge-hoarding Type 5 becomes the Sage, the power-seeking Type 8 becomes the Berserker. Wings as subclass modifiers and growth/stress lines as empowered/stressed states mean the system's internal structure maps to game mechanics without forcing it."
          />

          <SystemEntry
            name="MBTI (Beebe Model)"
            arrow="Abilities"
            what="Uses the Beebe 4-function stack model, not just the four-letter code. Each type has a Hero, Parent, Child, and Inferior function — four cognitive functions in four roles with distinct strengths and failure modes."
            why="Beebe's slot model is what makes this work. The same function plays completely differently depending on position: Ni as Hero (INFJ) is visionary pattern recognition, but Ni as Inferior (ESTP) fires as a sudden premonition under pressure. Four slots = four abilities, each with a role that matches the Beebe archetype — Hero is your main power, Inferior is your clutch comeback."
          />

          <SystemEntry
            name="Socionics"
            arrow="Element & Affinity"
            what="Groups 16 types into 4 quadras (Alpha, Beta, Gamma, Delta), each sharing valued information elements. Also classifies types into clubs (Researcher, Social, Practical, Humanitarian) based on cognitive orientation."
            why="Quadras have a natural elemental aesthetic: Alpha's cooperative Ne/Si + Fe/Ti maps to Light and Nature, Beta's power-oriented Se/Ni + Fe/Ti maps to Fire and Shadow. The club system adds a passive trait. Socionics is included separately from MBTI because the types don't map 1-to-1 — different notation, different functional analysis, and the quadra/club layer adds something MBTI doesn't have."
          />

          <SystemEntry
            name="Expanded Instincts"
            arrow="Combat Behavior"
            what="Rob Collopy's system from the Attitudinal Psyche community. 9 instinctual realms across 3 centers (Self-Survival, Interpersonal, Purpose), with 3 orthogonal triad systems that classify each realm's activation style, movement pattern, and energy source."
            why={<>
              This was a deliberate choice over classic enneagram sp/so/sx instincts. Classic instincts
              give you 3 options with limited mechanical depth. Expanded Instincts gives you 9 realms,
              each with a unique <em className="text-gray-300">combination</em> of triads — that means
              distinct activation styles, positioning behaviors, and regen sources that create genuinely
              different combat patterns. The tritype system (one realm per center) adds further
              differentiation. It's also a philosophically different model: types run <em className="text-gray-300">toward</em> aliveness
              rather than <em className="text-gray-300">away</em> from fear, which makes for more interesting character motivation.
            </>}
          />
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-xs leading-relaxed text-gray-600">
            These systems were chosen because they measure genuinely orthogonal dimensions of personality.
            AP measures cognitive priorities, Enneagram measures core motivation, MBTI measures information
            processing, Socionics measures social-cognitive orientation, and Expanded Instincts measures
            instinctual drives. Layering them creates characters with depth that no single system could produce.
          </p>
        </div>
      </div>
    </dialog>
  )
}

function SystemEntry({ name, arrow, what, why }: {
  name: string
  arrow: string
  what: string
  why: string | React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-100">{name}</h3>
        <span className="rounded-full bg-indigo-600/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
          &rarr; {arrow}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-300">What it measures: </span>
        {what}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-300">Why this mapping: </span>
        {why}
      </p>
    </div>
  )
}

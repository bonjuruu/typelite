import { useEffect, useRef } from "react";
import { SystemEntry } from "./SystemEntry.tsx";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!open) return null;

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
            <p className="mt-1 text-sm text-gray-500">
              Why these systems, and why these mappings
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="mb-8 text-sm leading-relaxed text-gray-400">
          <p>
            Typelite turns real personality typology into a roguelite character
            builder. Five systems, each measuring something genuinely different
            about how people think and act, map onto five distinct game domains.
            The goal isn't just a character generator - it's a framework where
            your real personality produces a character that{" "}
            <em className="text-gray-300">actually plays differently</em>.
          </p>
        </div>

        <div className="space-y-6">
          <SystemEntry
            name="Attitudinal Psyche"
            arrow="Base Stats"
            what="Ranks four cognitive aspects - Volition, Logic, Emotion, Physics - from strongest to weakest. Your 1st is where you're confident, 2nd is flexible, 3rd is a sore spot, 4th you don't really care about."
            why="The four aspects map straight to four stat axes: V→Willpower, L→Intelligence, E→Spirit, F→Vitality. Position values (14/10/7/4) create real asymmetry - your character is shaped by where you're strong and where you defer, not just which box you checked."
          />

          <SystemEntry
            name="Enneagram"
            arrow="Class & Archetype"
            what="9 core motivations. Wings shade your type toward a neighbor, instinctual variants (sp/so/sx) change how the type shows up in practice, and growth/stress lines show where you go when things are good or bad."
            why="Enneagram types already have strong identities - the knowledge-hoarding 5 becomes the Sage, the power-hungry 8 becomes the Berserker. Wings work as subclass modifiers, growth/stress lines become empowered/stressed states. The structure just maps to game mechanics on its own."
          />

          <SystemEntry
            name="MBTI (Beebe Model)"
            arrow="Abilities"
            what="Uses the Beebe 4-function stack model, not just the four-letter code. Each type has a Hero, Parent, Child, and Inferior function - same 8 functions, but the slot changes how they work."
            why="Beebe's slot model is what makes this work. The same function plays completely differently depending on position: Ni as Hero (INFJ) is visionary pattern recognition, but Ni as Inferior (ESTP) fires as a sudden premonition under pressure. Four slots = four abilities, each matching the Beebe archetype - Hero is your main power, Inferior is your clutch comeback."
          />

          <SystemEntry
            name="Socionics"
            arrow="Element & Affinity"
            what="Groups 16 types into 4 quadras (Alpha, Beta, Gamma, Delta), each sharing valued information elements. Also sorts types into clubs (Researcher, Social, Practical, Humanitarian) based on cognitive orientation."
            why="Quadras have a natural elemental feel: Alpha's cooperative Ne/Si + Fe/Ti maps to Light and Nature, Beta's power-oriented Se/Ni + Fe/Ti maps to Fire and Shadow. Clubs add a passive trait. Socionics is separate from MBTI because the types don't map 1-to-1 - different notation, different function analysis, and the quadra/club layer covers ground MBTI doesn't."
          />

          <SystemEntry
            name="Expanded Instincts"
            arrow="Combat Behavior"
            what="Rob Collopy's system from the Attitudinal Psyche community. 9 instinctual realms across 3 centers (Self-Survival, Interpersonal, Purpose), with 3 orthogonal triad systems that classify each realm's activation style, movement pattern, and energy source."
            why={
              <>
                Picked this over classic enneagram sp/so/sx instincts.
                Classic instincts give you 3 options and not much to work with
                mechanically. Expanded Instincts gives you 9 realms, each with
                a unique <em className="text-gray-300">combination</em> of
                triads - different activation styles, positioning, and regen
                sources, so combat actually varies between realms. Tritype (one
                realm per center) adds another layer. It's also just a different
                philosophy: types run <em className="text-gray-300">toward</em>{" "}
                aliveness instead of <em className="text-gray-300">away</em>{" "}
                from fear, which is more fun for character building.
              </>
            }
          />
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-xs leading-relaxed text-gray-600">
            These five systems each measure something different - AP covers
            cognitive priorities, Enneagram covers motivation, MBTI covers
            information processing, Socionics covers social-cognitive
            orientation, and Expanded Instincts covers instinctual drives.
            Stacking them gives characters more depth than any one system
            could on its own.
          </p>
        </div>
      </div>
    </dialog>
  );
}

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
            Typelite turns typology systems into a roguelite character builder.
            Five systems each measuring a different area of psychology, mapped
            into five game domains. It's a fun way to gamify yourself and see
            how different type combinations interact.
          </p>
        </div>

        <div className="space-y-6">
          <SystemEntry
            name="Attitudinal Psyche"
            arrow="Base Stats"
            what="Ranks four cognitive aspects (Volition, Logic, Emotion, Physics) from strongest to weakest. Your 1st is where you're confident, 2nd is flexible, 3rd is insecure, 4th is unbothered."
            why="The four aspects map straight to four stat axes: V→Willpower, L→Intelligence, E→Spirit, F→Vitality. In AP, position reflects your attitude toward an aspect, not how strong you are at it. In Typelite, position directly sets your stat value. It's a simplification to make the game work."
          />

          <SystemEntry
            name="Enneagram"
            arrow="Class & Archetype"
            what="9 core motivations. Wings shade your type toward a neighbor, instinctual variants (sp/so/sx) change how the type shows up in practice, and growth/stress lines show where you go when things are good or bad."
            why="Each type is distinct enough to map to an archetype naturally (5 is the Sage, 8 is the Berserker, etc.). The wings, instincts, and growth/stress lines act as modifiers on top."
          />

          <SystemEntry
            name="Jungian Type"
            arrow="Abilities"
            what="Based on Jung's cognitive function theory. Each type leads with different mental processes (perceiving and judging, each with introverted and extraverted forms) in a specific order. The 4 function stack model assigns archetypal roles to each position in the stack, which is what Typelite uses for abilities."
            why="The same function plays completely differently depending on position: Ni as Hero (INFJ) is visionary pattern recognition, but Ni as Inferior (ESTP) fires as a sudden premonition under pressure. Four slots = four abilities. Hero is your main power, Inferior is your clutch comeback."
          />

          <SystemEntry
            name="Socionics"
            arrow="Element & Affinity"
            what="Shares roots with Jungian type theory but focuses on how types relate to each other. Groups 16 types into 4 quadras that share valued functions, and clubs that share cognitive strengths (logic + intuition = Researcher, ethics + sensing = Social, etc.)."
            why="Typelite uses quadras for element affinity since types in the same quadra share a natural vibe. Clubs determine a passive trait. It's separate from Jungian type because despite similar building blocks, socionics cares more about dynamics between types than what's going on inside one person."
          />

          <SystemEntry
            name="Expanded Instincts"
            arrow="Combat Behavior"
            what="Expands the classic 3 instincts (sp/so/sx) into 9 realms across 3 centers (Self-Survival, Interpersonal, Purpose). Each realm has a different activation style, movement pattern, and energy source."
            why={
              <>
                Picked this over classic enneagram sp/so/sx instincts. Classic
                instincts give you 3 options and not much to work with
                mechanically. Expanded Instincts gives you 9 realms, each with a
                unique <em className="text-gray-300">combination</em> of triads.
                Different activation styles, positioning, and regen sources, so
                combat actually varies between realms. Tritype (one realm per
                center) adds another layer. It's also just a different
                philosophy: types run <em className="text-gray-300">toward</em>{" "}
                aliveness instead of <em className="text-gray-300">away</em>{" "}
                from fear, which is more fun for character building.
              </>
            }
          />
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-xs leading-relaxed text-gray-600">
            These five systems each measure something different. AP covers
            cognitive priorities, Enneagram covers motivation, Jungian Type
            covers information processing, Socionics covers social-cognitive
            orientation, and Expanded Instincts covers instinctual drives.
            Stacking them gives characters more depth than any one system could
            on its own.
          </p>
        </div>

      </div>
    </dialog>
  );
}

import { forwardRef } from 'react'
import type { Character, StatName } from '../../engine/types.ts'
import { computeAbilityPower } from '../../engine/modifiers.ts'
import { generateSystemInsights } from '../../engine/insights.ts'

// ============================================================
// PROPS
// ============================================================

interface ShareCardProps {
  character: Character
  characterName: string
}

// ============================================================
// CONSTANTS
// ============================================================

const STAT_CONFIG: { key: StatName; label: string; color: string }[] = [
  { key: 'willpower', label: 'WIL', color: '#f59e0b' },
  { key: 'intelligence', label: 'INT', color: '#3b82f6' },
  { key: 'spirit', label: 'SPR', color: '#a855f7' },
  { key: 'vitality', label: 'VIT', color: '#22c55e' },
]

const MAX_STAT = 20

const ELEMENT_EMOJI: Record<string, string> = {
  Light: '\u2728',
  Nature: '\ud83c\udf3f',
  Fire: '\ud83d\udd25',
  Shadow: '\ud83c\udf11',
  Earth: '\u26f0\ufe0f',
  Metal: '\u2694\ufe0f',
  Wind: '\ud83c\udf2c\ufe0f',
  Water: '\ud83c\udf0a',
}

const SLOT_LABELS: Record<string, string> = {
  hero: 'H',
  parent: 'P',
  child: 'C',
  inferior: 'I',
}

// ============================================================
// COMPONENT — fixed-size card for image export
// ============================================================

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ character, characterName }, ref) {
    const insightList = generateSystemInsights(character).slice(0, 2)

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          height: 800,
          padding: 32,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(180deg, #0a0a1a 0%, #111827 50%, #0a0a1a 100%)',
          color: '#f3f4f6',
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: -9999,
          top: -9999,
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '1px solid #374151', paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f3f4f6', lineHeight: 1.2 }}>
            {characterName}
          </div>
          <div style={{ fontSize: 16, color: '#818cf8', marginTop: 4 }}>
            {character.title}
          </div>
        </div>

        {/* Insights (compact, max 2) */}
        {insightList.length > 0 && (
          <div style={{ marginBottom: 12, padding: 8, background: '#1e1b4b20', border: '1px solid #312e8140', borderRadius: 6 }}>
            {insightList.map((insight, index) => (
              <div key={index} style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.4, marginBottom: index < insightList.length - 1 ? 4 : 0 }}>
                <span style={{ color: '#818cf8', marginRight: 4 }}>&bull;</span>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280', marginBottom: 8 }}>
            Stats
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {STAT_CONFIG.map(({ key, label, color }) => {
              const value = character.stats[key]
              return (
                <div key={key} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                </div>
              )
            })}
          </div>
          {/* Stat bars */}
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            {STAT_CONFIG.map(({ key, color }) => {
              const pct = Math.min((character.stats[key] / MAX_STAT) * 100, 100)
              return (
                <div key={key} style={{ flex: 1, height: 4, borderRadius: 2, background: '#1f2937' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: color }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Archetype */}
        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280', marginBottom: 4 }}>
            Archetype
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6' }}>
            {character.archetype.className}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, lineHeight: 1.4 }}>
            {character.archetype.description.length > 120
              ? character.archetype.description.slice(0, 120) + '...'
              : character.archetype.description}
          </div>
        </div>

        {/* Abilities — compact grid */}
        {character.abilities.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280', marginBottom: 6 }}>
              Abilities
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {character.abilities.map((ability) => {
                const power = computeAbilityPower(ability, character.stats)
                return (
                  <div
                    key={ability.slot}
                    style={{ background: '#111827', border: '1px solid #374151', borderRadius: 6, padding: 8 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase' }}>
                        {SLOT_LABELS[ability.slot]} — {ability.cognitiveFunction}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#d1d5db', background: '#374151', borderRadius: 4, padding: '1px 6px' }}>
                        {power}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', marginTop: 2 }}>
                      {ability.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Element + Combat — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280', marginBottom: 4 }}>
              Element
            </div>
            <div style={{ fontSize: 20, lineHeight: 1 }}>
              {ELEMENT_EMOJI[character.element.element]}{' '}
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f3f4f6' }}>{character.element.element}</span>
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{character.element.quadra} quadra</div>
          </div>
          <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280', marginBottom: 4 }}>
              Combat
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f3f4f6' }}>
              {character.combatBehavior.combatOrientation}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              {character.combatBehavior.activationStyle} / {character.combatBehavior.positioning}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#4b5563' }}>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>Type</span>lite
          </div>
        </div>
      </div>
    )
  },
)

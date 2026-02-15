import type { SystemId } from '../../engine/types.ts'

export interface SystemMeta {
  id: SystemId
  name: string
  description: string
  domain: string
}

export const SYSTEM_META_LIST: SystemMeta[] = [
  { id: 'attitudinal', name: 'Attitudinal Psyche', description: '4 aspects ordered by priority', domain: 'Base Stats' },
  { id: 'enneagram', name: 'Enneagram', description: '9 types with wings and growth lines', domain: 'Class' },
  { id: 'mbti', name: 'MBTI', description: '16 types via Beebe 4-function stack', domain: 'Abilities' },
  { id: 'socionics', name: 'Socionics', description: '16 types across 4 quadras', domain: 'Element' },
  { id: 'instincts', name: 'Expanded Instincts', description: '9 realms across 3 centers', domain: 'Combat' },
]

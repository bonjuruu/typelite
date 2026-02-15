import type { MBTIType } from '../../../engine/types.ts'
import type { BuilderSelections } from '../../../hooks/useCharacterGenerator.ts'
import { MBTI_TYPE_LIST } from '../../../hooks/useCharacterGenerator.ts'
import { Select } from '../../common/Select.tsx'

interface MBTISelectorProps {
  selections: BuilderSelections
  onUpdateSelection: <K extends keyof BuilderSelections>(key: K, value: BuilderSelections[K]) => void
}

export function MBTISelector({ selections, onUpdateSelection }: MBTISelectorProps) {
  return (
    <Select
      value={selections.mbti ?? ''}
      onChange={(value) => onUpdateSelection('mbti', (value as MBTIType) || null)}
      placeholder="Select MBTI type..."
      optionList={MBTI_TYPE_LIST.map((type) => ({ value: type, label: type }))}
    />
  )
}

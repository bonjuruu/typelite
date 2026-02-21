export interface StatBlock {
  willpower: number; // derived from Volition (AP)
  intelligence: number; // derived from Logic (AP)
  spirit: number; // derived from Emotion (AP)
  vitality: number; // derived from Physics (AP)
}

export type StatName = keyof StatBlock;

export interface StatBreakdown {
  base: StatBlock;
  baseSource: string;
  multipliers: Partial<Record<StatName, number>>;
  multiplierSource: string;
  overrides: Partial<StatBlock> | null;
}

import type {
  SystemId,
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
} from "../engine/types/index.ts";

export interface BuilderSelections {
  attitudinal: APType | null;
  enneagramType: EnneagramNumber | null;
  enneagramWing: EnneagramNumber | null;
  enneagramInstinct: EnneagramInstinct | null;
  instinctStackEnabled: boolean;
  instinctSecond: EnneagramInstinct | null;
  tritypeEnabled: boolean;
  tritypeSecondFix: EnneagramNumber | null;
  tritypeSecondFixWing: EnneagramNumber | null;
  tritypeThirdFix: EnneagramNumber | null;
  tritypeThirdFixWing: EnneagramNumber | null;
  mbti: MBTIType | null;
  socionics: SocionicsType | null;
  instinctRealm: InstinctRealm | null;
  instinctTritypeEnabled: boolean;
  instinctSecondRealm: InstinctRealm | null;
  instinctThirdRealm: InstinctRealm | null;
}

export type EnabledSystems = Record<SystemId, boolean>;

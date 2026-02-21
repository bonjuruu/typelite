import type { PassiveTrait } from "./element.ts";

export type InstinctCenter = "SUR" | "INT" | "PUR";

export type InstinctRealm =
  | "FD" // Fortitude
  | "SY" // Security
  | "SM" // Self-Management
  | "AY" // Alchemy
  | "CY" // Community
  | "BG" // Bonding
  | "SS" // Self-Significance
  | "EX" // Existentialism
  | "UN"; // Unknown

export type ExperientialTriad =
  | "Memorializing"
  | "Immersing"
  | "Distinguishing";
export type MovementTriad = "Escaping" | "Aligning" | "Directing";
export type SourceTriad = "Internalizing" | "Externalizing" | "Exchanging";

export interface CombatBehavior {
  realm: InstinctRealm;
  center: InstinctCenter;
  combatOrientation: string;
  activationStyle: ExperientialTriad;
  positioning: MovementTriad;
  regenSource: SourceTriad;
  passives: PassiveTrait[];
}

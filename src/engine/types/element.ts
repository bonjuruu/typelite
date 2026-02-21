export type Element =
  | "Light"
  | "Nature"
  | "Fire"
  | "Shadow"
  | "Earth"
  | "Metal"
  | "Wind"
  | "Water";

export type Quadra = "Alpha" | "Beta" | "Gamma" | "Delta";

export type Club = "Researcher" | "Social" | "Practical" | "Humanitarian";

export interface ElementAffinity {
  element: Element;
  quadra: Quadra;
  club: Club;
  passiveTrait: PassiveTrait;
}

export interface PassiveTrait {
  name: string;
  description: string;
  source: string;
}

import type { Element } from "../engine/types/index.ts";

export const ELEMENT_LIST: readonly Element[] = [
  "Light",
  "Nature",
  "Fire",
  "Shadow",
  "Earth",
  "Metal",
  "Wind",
  "Water",
] as const;

export const ELEMENT_EMOJI: Record<Element, string> = {
  Light: "\u2728",
  Nature: "\ud83c\udf3f",
  Fire: "\ud83d\udd25",
  Shadow: "\ud83c\udf11",
  Earth: "\u26f0\ufe0f",
  Metal: "\u2694\ufe0f",
  Wind: "\ud83c\udf2c\ufe0f",
  Water: "\ud83c\udf0a",
};

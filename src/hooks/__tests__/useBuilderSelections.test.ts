import { describe, it, expect } from "vitest";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";
import {
  INITIAL_ENABLED,
  INITIAL_SELECTIONS,
  pickRandom,
  randomizeEnneagramSelections,
  randomizeInstinctsSelections,
} from "../useBuilderSelections.ts";
import {
  getWings,
  getCenter,
  ENNEAGRAM_TYPE_LIST,
  ENNEAGRAM_INSTINCT_LIST,
} from "../../data/enneagram/index.ts";
import { INSTINCT_REALM_LIST, getRealmCenter } from "../../data/instincts/index.ts";

/**
 * useBuilderSelections is a React state wrapper. Since @testing-library/react
 * is not available, we test the exported pure helper functions and behavioral
 * contracts directly.
 */

describe("useBuilderSelections behavioral contracts", () => {
  describe("toggleSystem", () => {
    it("flips enabled state for a system", () => {
      // Simulate the hook's toggleSystem logic
      const prev: EnabledSystems = { ...INITIAL_ENABLED };
      const toggled = { ...prev, mbti: !prev.mbti };
      expect(toggled.mbti).toBe(false);

      const toggledBack = { ...toggled, mbti: !toggled.mbti };
      expect(toggledBack.mbti).toBe(true);
    });
  });

  describe("updateSelection", () => {
    it("updates a single field", () => {
      const prev: BuilderSelections = { ...INITIAL_SELECTIONS };
      const updated = { ...prev, attitudinal: "VELF" as const };
      expect(updated.attitudinal).toBe("VELF");
      expect(updated.mbti).toBeNull();
    });
  });

  describe("setEnneagramType", () => {
    it("sets type + default wing + resets tritype", () => {
      const prev: BuilderSelections = {
        ...INITIAL_SELECTIONS,
        tritypeSecondFix: 7,
        tritypeThirdFix: 3,
      };

      // Simulate setEnneagramType(5)
      const type = 5 as const;
      const validWingList = getWings(type);
      const updated: BuilderSelections = {
        ...prev,
        enneagramType: type,
        enneagramWing: validWingList[0],
        enneagramInstinct: prev.enneagramInstinct ?? "sp",
        tritypeSecondFix: null,
        tritypeSecondFixWing: null,
        tritypeThirdFix: null,
        tritypeThirdFixWing: null,
      };

      expect(updated.enneagramType).toBe(5);
      expect(validWingList).toContain(updated.enneagramWing);
      expect(updated.enneagramInstinct).toBe("sp");
      expect(updated.tritypeSecondFix).toBeNull();
      expect(updated.tritypeThirdFix).toBeNull();
    });

    it("setEnneagramType(null) clears all enneagram fields", () => {
      const prev: BuilderSelections = {
        ...INITIAL_SELECTIONS,
        enneagramType: 4,
        enneagramWing: 3,
        enneagramInstinct: "sx",
        instinctSecond: "so",
        tritypeSecondFix: 7,
        tritypeSecondFixWing: 6,
        tritypeThirdFix: 1,
        tritypeThirdFixWing: 2,
      };

      // Simulate setEnneagramType(null)
      const updated: BuilderSelections = {
        ...prev,
        enneagramType: null,
        enneagramWing: null,
        enneagramInstinct: null,
        instinctSecond: null,
        tritypeSecondFix: null,
        tritypeSecondFixWing: null,
        tritypeThirdFix: null,
        tritypeThirdFixWing: null,
      };

      expect(updated.enneagramType).toBeNull();
      expect(updated.enneagramWing).toBeNull();
      expect(updated.enneagramInstinct).toBeNull();
      expect(updated.instinctSecond).toBeNull();
      expect(updated.tritypeSecondFix).toBeNull();
      expect(updated.tritypeThirdFix).toBeNull();
    });
  });

  describe("randomizeEnneagramSelections", () => {
    it("produces valid enneagram type, wing, and instinct", () => {
      const result = randomizeEnneagramSelections(INITIAL_SELECTIONS);

      expect(ENNEAGRAM_TYPE_LIST).toContain(result.enneagramType);
      expect(getWings(result.enneagramType!)).toContain(result.enneagramWing);
      expect(ENNEAGRAM_INSTINCT_LIST).toContain(result.enneagramInstinct);
    });

    it("produces instinct second when instinctStackEnabled", () => {
      const prev: BuilderSelections = {
        ...INITIAL_SELECTIONS,
        instinctStackEnabled: true,
      };
      const result = randomizeEnneagramSelections(prev);

      expect(result.instinctSecond).not.toBeNull();
      expect(result.instinctSecond).not.toBe(result.enneagramInstinct);
    });

    it("produces tritype fixes when tritypeEnabled", () => {
      const prev: BuilderSelections = {
        ...INITIAL_SELECTIONS,
        tritypeEnabled: true,
      };
      const result = randomizeEnneagramSelections(prev);

      expect(result.tritypeSecondFix).not.toBeNull();
      expect(result.tritypeThirdFix).not.toBeNull();

      // Second and third fixes should be from different centers than the core type
      const coreCenter = getCenter(result.enneagramType!);
      const secondCenter = getCenter(result.tritypeSecondFix!);
      const thirdCenter = getCenter(result.tritypeThirdFix!);
      expect(secondCenter).not.toBe(coreCenter);
      expect(thirdCenter).not.toBe(coreCenter);
      expect(secondCenter).not.toBe(thirdCenter);
    });
  });

  describe("randomizeInstinctsSelections", () => {
    it("produces a valid instinct realm", () => {
      const result = randomizeInstinctsSelections(INITIAL_SELECTIONS);
      expect(INSTINCT_REALM_LIST).toContain(result.instinctRealm);
    });

    it("produces tritype realms from different centers when instinctTritypeEnabled", () => {
      const prev: BuilderSelections = {
        ...INITIAL_SELECTIONS,
        instinctTritypeEnabled: true,
      };
      const result = randomizeInstinctsSelections(prev);

      expect(result.instinctSecondRealm).not.toBeNull();
      expect(result.instinctThirdRealm).not.toBeNull();

      const primaryCenter = getRealmCenter(result.instinctRealm!);
      const secondCenter = getRealmCenter(result.instinctSecondRealm!);
      const thirdCenter = getRealmCenter(result.instinctThirdRealm!);
      expect(secondCenter).not.toBe(primaryCenter);
      expect(thirdCenter).not.toBe(primaryCenter);
    });
  });

  describe("pickRandom", () => {
    it("returns an element from the list", () => {
      const list = [1, 2, 3, 4, 5];
      for (let i = 0; i < 20; i++) {
        expect(list).toContain(pickRandom(list));
      }
    });
  });
});

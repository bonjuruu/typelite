import { describe, it, expect } from "vitest";
import type { BuilderSelections } from "../../../types/builder.ts";
import { getSelectionSummary } from "../selectionSummary.ts";

const BASE_SELECTIONS: BuilderSelections = {
  attitudinal: null,
  enneagramType: null,
  enneagramWing: null,
  enneagramInstinct: null,
  instinctStackEnabled: false,
  instinctSecond: null,
  tritypeEnabled: false,
  tritypeSecondFix: null,
  tritypeSecondFixWing: null,
  tritypeThirdFix: null,
  tritypeThirdFixWing: null,
  mbti: null,
  socionics: null,
  instinctRealm: null,
  instinctTritypeEnabled: false,
  instinctSecondRealm: null,
  instinctThirdRealm: null,
};

describe("getSelectionSummary", () => {
  describe("attitudinal", () => {
    it("returns AP type when set", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        attitudinal: "VLEF",
      };
      expect(getSelectionSummary("attitudinal", selections)).toBe("VLEF");
    });

    it("returns null when null", () => {
      expect(getSelectionSummary("attitudinal", BASE_SELECTIONS)).toBeNull();
    });
  });

  describe("enneagram", () => {
    it("returns null when type is null", () => {
      expect(getSelectionSummary("enneagram", BASE_SELECTIONS)).toBeNull();
    });

    it("returns full string with all fields", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        enneagramType: 5,
        enneagramWing: 4,
        enneagramInstinct: "sp",
      };
      expect(getSelectionSummary("enneagram", selections)).toBe("5w4 sp");
    });

    it("omits wing when null", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        enneagramType: 5,
        enneagramWing: null,
        enneagramInstinct: "sp",
      };
      expect(getSelectionSummary("enneagram", selections)).toBe("5 sp");
    });

    it("includes stack when enabled", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        enneagramType: 5,
        enneagramWing: 4,
        enneagramInstinct: "sp",
        instinctStackEnabled: true,
        instinctSecond: "so",
      };
      expect(getSelectionSummary("enneagram", selections)).toBe("5w4 sp/so");
    });

    it("includes tritype when enabled", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        enneagramType: 5,
        enneagramWing: 4,
        enneagramInstinct: "sp",
        tritypeEnabled: true,
        tritypeSecondFix: 1,
        tritypeThirdFix: 4,
      };
      expect(getSelectionSummary("enneagram", selections)).toBe("5w4 sp 514");
    });
  });

  describe("mbti", () => {
    it("returns type when set", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        mbti: "INTJ",
      };
      expect(getSelectionSummary("mbti", selections)).toBe("INTJ");
    });

    it("returns null when null", () => {
      expect(getSelectionSummary("mbti", BASE_SELECTIONS)).toBeNull();
    });
  });

  describe("socionics", () => {
    it("returns type when set", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        socionics: "ILI",
      };
      expect(getSelectionSummary("socionics", selections)).toBe("ILI");
    });

    it("returns null when null", () => {
      expect(getSelectionSummary("socionics", BASE_SELECTIONS)).toBeNull();
    });
  });

  describe("instincts", () => {
    it("returns null when realm is null", () => {
      expect(getSelectionSummary("instincts", BASE_SELECTIONS)).toBeNull();
    });

    it("returns realm when set", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        instinctRealm: "FD",
      };
      expect(getSelectionSummary("instincts", selections)).toBe("FD");
    });

    it("returns tritype format when enabled", () => {
      const selections: BuilderSelections = {
        ...BASE_SELECTIONS,
        instinctRealm: "FD",
        instinctTritypeEnabled: true,
        instinctSecondRealm: "AY",
        instinctThirdRealm: "SS",
      };
      expect(getSelectionSummary("instincts", selections)).toBe(
        "FD / AY / SS",
      );
    });
  });
});

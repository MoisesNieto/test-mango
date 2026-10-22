import { describe, expect, it } from "vitest";
import {
  assertValidBounds,
  keepSelectionInBounds,
  snapToAllowedValue,
  updateSelection,
  updateSnappedSelection
} from "@/domain/range/rangeRules";

describe("range rules", () => {
  it("rejects invalid bounds", () => {
    expect(() => assertValidBounds({ min: 5, max: 5 })).toThrow();
    expect(() => assertValidBounds({ min: Number.NaN, max: 10 })).toThrow();
  });

  it("keeps the handles within bounds and prevents crossing", () => {
    expect(
      updateSelection({ lower: 20, upper: 80 }, "lower", 90, { min: 0, max: 100 })
    ).toEqual({ lower: 80, upper: 80 });
  });

  it("clamps both values when an editable boundary changes", () => {
    expect(
      keepSelectionInBounds({ lower: 10, upper: 90 }, { min: 30, max: 70 })
    ).toEqual({ lower: 30, upper: 70 });
  });

  it("snaps to the nearest allowed number, preferring the lower value on ties", () => {
    expect(snapToAllowedValue(8, [1, 5, 11])).toBe(5);
  });

  it("prevents snapped handles from crossing", () => {
    expect(
      updateSnappedSelection(
        { lower: 5, upper: 11 },
        "lower",
        20,
        [1, 5, 11, 20]
      )
    ).toEqual({ lower: 11, upper: 11 });
  });
});

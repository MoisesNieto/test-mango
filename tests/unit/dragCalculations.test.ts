import { describe, expect, it } from "vitest";
import { pointerPositionToValue } from "@/presentation/range/dragCalculations";

describe("pointerPositionToValue", () => {
  it("maps the track edges and midpoint to the corresponding range values", () => {
    expect(pointerPositionToValue(100, 100, 200, 10, 110)).toBe(10);
    expect(pointerPositionToValue(200, 100, 200, 10, 110)).toBe(60);
    expect(pointerPositionToValue(300, 100, 200, 10, 110)).toBe(110);
  });

  it("clamps positions outside the track and ignores invalid geometry", () => {
    expect(pointerPositionToValue(50, 100, 200, 0, 100)).toBe(0);
    expect(pointerPositionToValue(100, 0, 0, 0, 100)).toBeNull();
    expect(pointerPositionToValue(50, 0, 100, 10, 10)).toBeNull();
  });
});

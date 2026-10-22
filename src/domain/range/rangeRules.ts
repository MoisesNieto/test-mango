import type {
  FixedRangeValues,
  RangeBounds,
  SelectedRange
} from "./Range";

export function isValidBounds(bounds: RangeBounds): boolean {
  return (
    Number.isFinite(bounds.min) &&
    Number.isFinite(bounds.max) &&
    bounds.min < bounds.max
  );
}

export function assertValidBounds(bounds: RangeBounds): void {
  if (!isValidBounds(bounds)) {
    throw new Error("Range bounds must be finite numbers with min < max.");
  }
}

export function isValidFixedValues(values: FixedRangeValues): boolean {
  return !(
    values.length < 2 ||
    values.some((value, index) => {
      return (
        !Number.isFinite(value) ||
        (index > 0 && value <= values[index - 1])
      );
    })
  );
}

export function assertValidFixedValues(values: FixedRangeValues): void {
  if (!isValidFixedValues(values)) {
    throw new Error(
      "Fixed range values must contain at least two finite, strictly increasing numbers."
    );
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function keepSelectionInBounds(
  selection: SelectedRange,
  bounds: RangeBounds
): SelectedRange {
  assertValidBounds(bounds);
  const lower = clamp(selection.lower, bounds.min, bounds.max);
  const upper = clamp(selection.upper, bounds.min, bounds.max);

  return lower <= upper ? { lower, upper } : { lower: upper, upper: lower };
}

export function updateSelection(
  selection: SelectedRange,
  handle: "lower" | "upper",
  value: number,
  bounds: RangeBounds
): SelectedRange {
  assertValidBounds(bounds);
  const nextValue = clamp(value, bounds.min, bounds.max);

  if (handle === "lower") {
    return { lower: Math.min(nextValue, selection.upper), upper: selection.upper };
  }

  return { lower: selection.lower, upper: Math.max(nextValue, selection.lower) };
}

export function snapToAllowedValue(
  value: number,
  values: FixedRangeValues
): number {
  assertValidFixedValues(values);

  return values.reduce((nearest, candidate) => {
    return Math.abs(candidate - value) < Math.abs(nearest - value)
      ? candidate
      : nearest;
  }, values[0]);
}

export function updateSnappedSelection(
  selection: SelectedRange,
  handle: "lower" | "upper",
  value: number,
  values: FixedRangeValues
): SelectedRange {
  assertValidFixedValues(values);
  const snappedValue = snapToAllowedValue(value, values);

  if (handle === "lower") {
    return {
      lower: Math.min(snappedValue, selection.upper),
      upper: selection.upper
    };
  }

  return {
    lower: selection.lower,
    upper: Math.max(snappedValue, selection.lower)
  };
}

export function rangeFromFixedValues(
  values: FixedRangeValues
): RangeBounds {
  assertValidFixedValues(values);
  return { min: values[0], max: values[values.length - 1] };
}

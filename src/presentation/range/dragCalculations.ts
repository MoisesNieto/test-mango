export function pointerPositionToValue(
  clientX: number,
  left: number,
  width: number,
  min: number,
  max: number
): number | null {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(left) ||
    !Number.isFinite(width) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    width <= 0 ||
    min >= max
  ) {
    return null;
  }

  const percentage = Math.min(Math.max((clientX - left) / width, 0), 1);
  return min + percentage * (max - min);
}

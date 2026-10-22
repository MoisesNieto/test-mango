export interface RangeBounds {
  min: number;
  max: number;
}

export type FixedRangeValues = readonly number[];

export interface SelectedRange {
  lower: number;
  upper: number;
}

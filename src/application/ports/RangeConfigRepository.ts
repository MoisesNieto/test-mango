import type { FixedRangeValues, RangeBounds } from "@/domain/range/Range";
import type { Result } from "./Result";

export interface RangeConfigRepository {
  getDynamicBounds(): Promise<Result<RangeBounds>>;
  getFixedValues(): Promise<Result<FixedRangeValues>>;
}

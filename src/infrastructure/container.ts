import { createMockRangeConfigAdapter } from "./adapters/MockRangeConfigAdapter";
import { createMockHttpClient } from "./http/MockHttpClient";

export const rangeConfigRepository = createMockRangeConfigAdapter(
  createMockHttpClient()
);

export const getDynamicRange = rangeConfigRepository.getDynamicBounds;
export const getFixedValues = rangeConfigRepository.getFixedValues;

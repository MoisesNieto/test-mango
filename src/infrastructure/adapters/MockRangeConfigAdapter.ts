import {
  isValidBounds,
  isValidFixedValues
} from "@/domain/range/rangeRules";
import type { RangeConfigRepository } from "@/application/ports/RangeConfigRepository";
import { failure, success } from "@/application/ports/Result";
import type { HttpClient } from "../http/MockHttpClient";

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown): item is number => typeof item === "number")
  );
}

export function createMockRangeConfigAdapter(
  httpClient: HttpClient
): RangeConfigRepository {
  return {
    async getDynamicBounds() {
      let response: unknown;
      try {
        response = await httpClient.get("/api/range/dynamic");
      } catch {
        return failure("Could not load the range. Please try again.");
      }

      if (
        typeof response !== "object" ||
        response === null ||
        !("min" in response) ||
        !("max" in response) ||
        typeof response.min !== "number" ||
        typeof response.max !== "number"
      ) {
        return failure("The service returned an invalid range configuration.");
      }

      const bounds = { min: response.min, max: response.max };
      return isValidBounds(bounds)
        ? success(bounds)
        : failure("The service returned invalid range bounds.");
    },

    async getFixedValues() {
      let response: unknown;
      try {
        response = await httpClient.get("/api/range/fixed");
      } catch {
        return failure("Could not load the prices. Please try again.");
      }

      if (!isNumberArray(response)) {
        return failure("The service returned an invalid price list.");
      }

      return isValidFixedValues(response)
        ? success(response)
        : failure("The service returned an invalid price list.");
    }
  };
}

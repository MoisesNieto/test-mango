import { describe, expect, it } from "vitest";
import { createMockRangeConfigAdapter } from "@/infrastructure/adapters/MockRangeConfigAdapter";
import type { HttpClient } from "@/infrastructure/http/MockHttpClient";

describe("MockRangeConfigAdapter", () => {
  it("adapts mock HTTP responses to application contracts", async () => {
    const httpClient: HttpClient = {
      get: async (path) =>
        path.endsWith("dynamic") ? { min: 1, max: 100 } : [1.99, 5.99, 10.99]
    };
    const adapter = createMockRangeConfigAdapter(httpClient);

    await expect(adapter.getDynamicBounds()).resolves.toEqual({
      success: true,
      data: { min: 1, max: 100 }
    });
    await expect(adapter.getFixedValues()).resolves.toEqual({
      success: true,
      data: [1.99, 5.99, 10.99]
    });
  });

  it("surfaces invalid external response shapes", async () => {
    const adapter = createMockRangeConfigAdapter({
      get: async () => ({ unexpected: true })
    });

    await expect(adapter.getDynamicBounds()).resolves.toEqual({
      success: false,
      error: "The service returned an invalid range configuration."
    });
  });

  it("returns a user-facing failure when the HTTP request rejects", async () => {
    const adapter = createMockRangeConfigAdapter({
      get: async () => Promise.reject(new Error("network unavailable"))
    });

    await expect(adapter.getDynamicBounds()).resolves.toEqual({
      success: false,
      error: "Could not load the range. Please try again."
    });
  });

  it("rejects bounds and fixed values that violate domain rules", async () => {
    const dynamicAdapter = createMockRangeConfigAdapter({
      get: async () => ({ min: 10, max: 1 })
    });
    const fixedAdapter = createMockRangeConfigAdapter({
      get: async () => [1, 1]
    });

    await expect(dynamicAdapter.getDynamicBounds()).resolves.toMatchObject({
      success: false
    });
    await expect(fixedAdapter.getFixedValues()).resolves.toMatchObject({
      success: false
    });
  });
});

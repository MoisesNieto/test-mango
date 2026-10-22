import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (typeof window.PointerEvent === "undefined") {
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    value: window.MouseEvent
  });
}

Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
  configurable: true,
  value: () => undefined
});

afterEach(() => {
  cleanup();
});

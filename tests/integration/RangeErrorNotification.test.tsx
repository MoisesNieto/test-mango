import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RangeErrorNotification } from "@/presentation/feedback/RangeErrorNotification";

describe("RangeErrorNotification", () => {
  it("announces a loading failure accessibly", () => {
    render(
      <RangeErrorNotification message="Could not load the range. Please try again." />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load the range. Please try again."
    );
    expect(screen.getByText("Unable to load the range selector")).toBeInTheDocument();
  });
});

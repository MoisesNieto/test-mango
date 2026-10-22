import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Range } from "@/presentation/range/Range";

describe("Range presentation integration", () => {
  it("edits dynamic bounds and reports invalid endpoint values", () => {
    render(<Range mode="dynamic" bounds={{ min: 1, max: 100 }} />);

    expect(screen.getByRole("button", { name: /edit minimum range value/i })).toHaveTextContent("1");
    fireEvent.click(screen.getByRole("button", { name: /edit minimum range value/i }));
    const input = screen.getByRole("spinbutton", { name: "Minimum range value" });
    fireEvent.change(input, { target: { value: "20" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("button", { name: /edit minimum range value/i })).toHaveTextContent("20");
    fireEvent.click(screen.getByRole("button", { name: /edit minimum range value/i }));
    const invalidInput = screen.getByRole("spinbutton", { name: "Minimum range value" });
    fireEvent.change(invalidInput, { target: { value: "100" } });
    fireEvent.keyDown(invalidInput, { key: "Enter" });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Minimum must be less than maximum."
    );
    expect(screen.getByRole("button", { name: /edit minimum range value/i })).toHaveTextContent("20");

    fireEvent.click(screen.getByRole("button", { name: /edit maximum range value/i }));
    const invalidMaximum = screen.getByRole("spinbutton", { name: "Maximum range value" });
    fireEvent.change(invalidMaximum, { target: { value: "1" } });
    fireEvent.keyDown(invalidMaximum, { key: "Enter" });
    expect(screen.getByText("Maximum must be greater than minimum.")).toHaveAttribute(
      "role",
      "alert"
    );

    fireEvent.click(screen.getByRole("button", { name: /edit minimum range value/i }));
    const cancelledInput = screen.getByRole("spinbutton", { name: "Minimum range value" });
    fireEvent.change(cancelledInput, { target: { value: "30" } });
    fireEvent.keyDown(cancelledInput, { key: "Escape" });
    expect(screen.getByRole("button", { name: /edit minimum range value/i })).toHaveTextContent("20");

    fireEvent.click(screen.getByRole("button", { name: /edit minimum range value/i }));
    const nextInput = screen.getByRole("spinbutton", { name: "Minimum range value" });
    fireEvent.change(nextInput, { target: { value: "30" } });
    fireEvent.blur(nextInput);
    expect(screen.getByRole("button", { name: /edit minimum range value/i })).toHaveTextContent("30");
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("converts pointer coordinates to values and prevents a dragged handle from crossing", () => {
    render(<Range mode="dynamic" bounds={{ min: 1, max: 100 }} />);
    const [lowerHandle] = screen.getAllByRole("slider");
    const track = lowerHandle.parentElement;
    if (!track) {
      throw new Error("Range track was not rendered.");
    }
    Object.defineProperty(track, "getBoundingClientRect", {
      value: () => new DOMRect(10, 0, 100, 36)
    });

    fireEvent.pointerDown(lowerHandle, { pointerId: 1, clientX: 60 });
    expect(Number(lowerHandle.getAttribute("aria-valuenow"))).toBeLessThan(75.25);
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 110 });

    expect(lowerHandle).toHaveAttribute("aria-valuenow", "75.25");
    fireEvent.pointerUp(track, { pointerId: 1 });
  });

  it("renders fixed prices as non-editable and snaps keyboard interaction to allowed values", () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    render(<Range mode="fixed" values={values} />);

    expect(screen.getByLabelText("Minimum: 1.99")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit minimum/i })).not.toBeInTheDocument();
    const [lowerHandle] = screen.getAllByRole("slider");
    expect(lowerHandle).toHaveAttribute("aria-valuenow", "5.99");
    fireEvent.keyDown(lowerHandle, { key: "ArrowRight" });
    expect(lowerHandle).toHaveAttribute("aria-valuenow", "10.99");
    expect(values).toContain(Number(lowerHandle.getAttribute("aria-valuenow")));
  });
});

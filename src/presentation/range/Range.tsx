"use client";

import { useRef, useState } from "react";
import type {
  FixedRangeValues,
  RangeBounds,
  SelectedRange
} from "@/domain/range/Range";
import {
  keepSelectionInBounds,
  rangeFromFixedValues,
  updateSelection,
  updateSnappedSelection
} from "@/domain/range/rangeRules";
import { pointerPositionToValue } from "./dragCalculations";
import { RangeLabels } from "./RangeLabels";

type RangeProps =
  | { mode: "dynamic"; bounds: RangeBounds; values?: never }
  | { mode: "fixed"; values: FixedRangeValues; bounds?: never };

type Handle = "lower" | "upper";

function initialSelection(bounds: RangeBounds): SelectedRange {
  const span = bounds.max - bounds.min;
  return { lower: bounds.min + span * 0.25, upper: bounds.min + span * 0.75 };
}

export function Range(props: RangeProps) {
  if (props.mode === "fixed") {
    return (
      <RangeControl
        bounds={rangeFromFixedValues(props.values)}
        fixedValues={props.values}
      />
    );
  }

  return <RangeControl bounds={props.bounds} />;
}

interface RangeControlProps {
  bounds: RangeBounds;
  fixedValues?: FixedRangeValues;
}

function RangeControl({
  bounds: startingBounds,
  fixedValues
}: RangeControlProps) {
  const isFixed = fixedValues !== undefined;
  const [bounds, setBounds] = useState(startingBounds);
  const [selection, setSelection] = useState(() => {
    if (!fixedValues) {
      return initialSelection(startingBounds);
    }
    const lowerIndex = Math.floor((fixedValues.length - 1) * 0.25);
    const upperIndex = Math.ceil((fixedValues.length - 1) * 0.75);
    return {
      lower: fixedValues[lowerIndex],
      upper: fixedValues[upperIndex]
    };
  });
  const [dragging, setDragging] = useState<Handle | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  function moveHandle(handle: Handle, clientX: number): void {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const value = pointerPositionToValue(
      clientX,
      rect.left,
      rect.width,
      bounds.min,
      bounds.max
    );
    if (value === null) {
      return;
    }

    setSelection((current) =>
      fixedValues
        ? updateSnappedSelection(current, handle, value, fixedValues)
        : updateSelection(current, handle, value, bounds)
    );
  }

  function handlePointerDown(handle: Handle, event: React.PointerEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setDragging(handle);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveHandle(handle, event.clientX);
  }

  function changeBounds(nextBounds: RangeBounds): void {
    setBounds(nextBounds);
    setSelection((current) => keepSelectionInBounds(current, nextBounds));
  }

  function handleKeyDown(handle: Handle, event: React.KeyboardEvent<HTMLButtonElement>): void {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;
    if (direction === 0) {
      return;
    }

    event.preventDefault();
    setSelection((current) => {
      if (fixedValues) {
        const currentValue = current[handle];
        const currentIndex = fixedValues.reduce(
          (nearestIndex, value, index) =>
            Math.abs(value - currentValue) < Math.abs(fixedValues[nearestIndex] - currentValue)
              ? index
              : nearestIndex,
          0
        );
        const nextIndex = Math.min(
          Math.max(currentIndex + direction, 0),
          fixedValues.length - 1
        );
        return updateSnappedSelection(
          current,
          handle,
          fixedValues[nextIndex],
          fixedValues
        );
      }

      return updateSelection(
        current,
        handle,
        current[handle] + direction * ((bounds.max - bounds.min) / 100),
        bounds
      );
    });
  }

  const lowerPosition =
    ((selection.lower - bounds.min) / (bounds.max - bounds.min)) * 100;
  const upperPosition =
    ((selection.upper - bounds.min) / (bounds.max - bounds.min)) * 100;

  return (
    <section className="range-widget" aria-label="Range selector">
      <div
        className={`range-track${dragging ? " is-dragging" : ""}`}
        onPointerMove={(event) => {
          if (dragging) {
            moveHandle(dragging, event.clientX);
          }
        }}
        onPointerUp={() => setDragging(null)}
        onPointerCancel={() => setDragging(null)}
        ref={trackRef}
      >
        <div className="range-rail" />
        <div
          className="range-selected"
          style={{ left: `${lowerPosition}%`, width: `${upperPosition - lowerPosition}%` }}
        />
        {(["lower", "upper"] as const).map((handle) => {
          const value = selection[handle];
          const position = handle === "lower" ? lowerPosition : upperPosition;
          return (
            <button
              aria-label={handle === "lower" ? "Selected minimum value" : "Selected maximum value"}
              aria-valuemax={bounds.max}
              aria-valuemin={bounds.min}
              aria-valuenow={value}
              className={`range-handle${dragging === handle ? " is-active" : ""}`}
              key={handle}
              onKeyDown={(event) => handleKeyDown(handle, event)}
              onPointerDown={(event) => handlePointerDown(handle, event)}
              role="slider"
              style={{ left: `${position}%` }}
              type="button"
            />
          );
        })}
      </div>
      <div className="selected-values" aria-live="polite">
        <span>Selected range:</span>
        <strong>{selection.lower}</strong>
        <span aria-hidden="true">—</span>
        <strong>{selection.upper}</strong>
      </div>
      <RangeLabels
        bounds={bounds}
        editable={!isFixed}
        onBoundsChange={changeBounds}
      />
    </section>
  );
}

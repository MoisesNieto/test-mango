"use client";

import { useRef, useState } from "react";
import type { RangeBounds } from "@/domain/range/Range";

interface RangeLabelsProps {
  bounds: RangeBounds;
  editable: boolean;
  onBoundsChange: (bounds: RangeBounds) => void;
}

interface BoundaryLabelProps {
  label: "Minimum" | "Maximum";
  value: number;
  editable: boolean;
  validationMessage: string;
  onCommit: (value: number) => boolean;
}

function BoundaryLabel({
  label,
  value,
  editable,
  validationMessage,
  onCommit
}: BoundaryLabelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const cancelOnBlur = useRef(false);

  function beginEditing(): void {
    setDraft(String(value));
    setError(null);
    cancelOnBlur.current = false;
    setEditing(true);
  }

  function commit(): void {
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed)) {
      setError("Enter a valid number.");
    } else if (!onCommit(parsed)) {
      setError(validationMessage);
    } else {
      setError(null);
    }
    setEditing(false);
  }

  function handleBlur(): void {
    if (cancelOnBlur.current) {
      cancelOnBlur.current = false;
      return;
    }
    commit();
  }

  if (editing && editable) {
    return (
      <div className="boundary-label">
        <label>
          <span>{label}</span>
          <input
            aria-label={`${label} range value`}
            autoFocus
            inputMode="decimal"
            onBlur={handleBlur}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
              if (event.key === "Escape") {
                cancelOnBlur.current = true;
                setDraft(String(value));
                setError(null);
                setEditing(false);
              }
            }}
            type="number"
            value={draft}
          />
        </label>
        {error && <span role="alert">{error}</span>}
      </div>
    );
  }

  return (
    <div className="boundary-label">
      <span>{label}</span>
      {editable ? (
        <button
          aria-label={`Edit ${label.toLowerCase()} range value, ${value}`}
          className="boundary-value"
          onClick={beginEditing}
          type="button"
        >
          {value}
        </button>
      ) : (
        <span className="boundary-value" aria-label={`${label}: ${value}`}>
          {value}
        </span>
      )}
      {error && <span role="alert">{error}</span>}
    </div>
  );
}

export function RangeLabels({
  bounds,
  editable,
  onBoundsChange
}: RangeLabelsProps) {
  function updateBoundary(boundary: "min" | "max", value: number): boolean {
    const nextBounds = { ...bounds, [boundary]: value };
    if (nextBounds.min >= nextBounds.max) {
      return false;
    }
    onBoundsChange(nextBounds);
    return true;
  }

  return (
    <div className="range-labels">
      <BoundaryLabel
        editable={editable}
        label="Minimum"
        validationMessage="Minimum must be less than maximum."
        onCommit={(value) => updateBoundary("min", value)}
        value={bounds.min}
      />
      <BoundaryLabel
        editable={editable}
        label="Maximum"
        validationMessage="Maximum must be greater than minimum."
        onCommit={(value) => updateBoundary("max", value)}
        value={bounds.max}
      />
    </div>
  );
}

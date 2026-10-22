import Link from "next/link";
import { Range } from "@/presentation/range/Range";
import { RangeErrorNotification } from "@/presentation/feedback/RangeErrorNotification";
import { getFixedValues } from "@/infrastructure/container";

export default async function ExerciseTwoPage() {
  const result = await getFixedValues();

  return (
    <main className="page-shell">
      <Link className="back-link" href="/">← Home</Link>
      <p className="eyebrow">Exercise 2</p>
      <h1>Fixed values</h1>
      <p className="intro">
        The handles snap to allowed prices. The endpoints are informational and
        cannot be edited.
      </p>
      {result.success ? (
        <Range mode="fixed" values={result.data} />
      ) : (
        <RangeErrorNotification message={result.error} />
      )}
      <Link className="next-link" href="/exercise1">← View dynamic range</Link>
    </main>
  );
}

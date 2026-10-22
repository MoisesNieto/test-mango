import Link from "next/link";
import { Range } from "@/presentation/range/Range";
import { RangeErrorNotification } from "@/presentation/feedback/RangeErrorNotification";
import { getDynamicRange } from "@/infrastructure/container";

export default async function ExerciseOnePage() {
  const result = await getDynamicRange();

  return (
    <main className="page-shell">
      <Link className="back-link" href="/">← Home</Link>
      <p className="eyebrow">Exercise 1</p>
      <h1>Dynamic range</h1>
      <p className="intro">
        Drag the handles without crossing them. Edit the endpoints to change the
        range bounds.
      </p>
      {result.success ? (
        <Range mode="dynamic" bounds={result.data} />
      ) : (
        <RangeErrorNotification message={result.error} />
      )}
      <Link className="next-link" href="/exercise2">View fixed values →</Link>
    </main>
  );
}

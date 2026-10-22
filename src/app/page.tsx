import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Technical exercise</p>
      <h1>Range selector</h1>
      <p className="intro">
        Explore both versions of the custom component.
      </p>
      <nav className="exercise-links" aria-label="Exercises">
        <Link href="/exercise1">Exercise 1 · Dynamic range</Link>
        <Link href="/exercise2">Exercise 2 · Fixed values</Link>
      </nav>
    </main>
  );
}

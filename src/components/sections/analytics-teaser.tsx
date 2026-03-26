import Link from "next/link";

export function AnalyticsTeaser() {
  return (
    <section className="crex-section">
      <div className="crex-container">
        <div className="gradient-analytics overflow-hidden rounded-3xl px-6 py-10 text-white shadow-crex md:px-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Predictive Engine</p>
          <h2 className="mt-4 font-display text-5xl uppercase md:text-6xl">See the match before it turns</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            CREX tracks win probability, momentum, and player-vs-player pressure points so every investor immediately understands the product moat.
          </p>
          <Link href="/analytics" className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-crex-text">
            Explore Analytics
          </Link>
        </div>
      </div>
    </section>
  );
}

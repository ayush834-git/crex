import Link from "next/link";

export function AnalyticsTeaser() {
  return (
    <section className="crex-section crex-stage crex-stage-blue border-y border-white/16">
      <div className="crex-container">
        <div className="overflow-hidden rounded-[28px] border border-[rgba(250,204,21,0.24)] bg-[linear-gradient(135deg,rgba(76,29,149,0.94),rgba(29,78,216,0.78)_62%,rgba(109,40,217,0.88))] px-6 py-10 text-white shadow-[0_28px_48px_rgba(91,33,182,0.28)] md:px-10 md:py-14">
          <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-surface">Predictive Engine</p>
          <h2 className="mt-4 font-poster text-[4rem] uppercase leading-[0.84] text-white crex-title-shadow md:text-[5.75rem]">See the match before it turns</h2>
          <p className="mt-4 max-w-2xl text-2xl uppercase leading-7 text-white/92 md:text-3xl">
            CREX tracks win probability, momentum, and player-vs-player pressure points so every investor immediately understands the product moat.
          </p>
          <Link href="/analytics" className="mt-8 inline-flex crex-button crex-button-secondary text-2xl">
            Explore Analytics
          </Link>
        </div>
      </div>
    </section>
  );
}

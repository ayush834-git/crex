"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Get weekly IPL intelligence in your inbox.");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("Subscribed. We will send the next CREX scouting drop.");
    setEmail("");
  };

  return (
    <footer className="crex-stage crex-stage-pink mt-20 border-t border-white/16 text-white">
      <div className="crex-container grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-5xl uppercase tracking-[0.08em] text-white crex-blue-shadow">CREX</p>
          <p className="mt-3 text-lg leading-6 text-white/84">
            Live scores, predictive analytics, and fantasy intelligence built for every IPL night.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-crex-surface">Navigation</h3>
          <div className="mt-4 flex flex-col gap-3 text-lg uppercase text-white">
            <Link href="/">Home</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/players">Players</Link>
            <Link href="/analytics">Analytics</Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-crex-surface">Social</h3>
          <div className="mt-4 flex items-center gap-3">
            <Link href="https://x.com" className="crex-card crex-card-interactive p-3 text-crex-accent">
              <Twitter size={18} />
            </Link>
            <Link href="https://instagram.com" className="crex-card crex-card-interactive p-3 text-crex-accent">
              <Instagram size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-crex-surface">Newsletter</h3>
          <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-[56px] rounded-xl border-2 border-white/24 bg-white/92 px-4 text-lg text-crex-text outline-none placeholder:text-crex-muted"
            />
            <button type="submit" className="crex-button tap-target text-xl">
              Subscribe
            </button>
            <p className="text-base leading-5 text-white/82">{message}</p>
          </form>
        </div>
      </div>
      <div className="border-t border-white/16 py-4 text-center font-display text-lg uppercase tracking-[0.08em] text-white/78">
        Copyright 2025 CREX. Not affiliated with BCCI or IPL.
      </div>
    </footer>
  );
}

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
    <footer className="mt-20 bg-[#0A0F1E] text-white">
      <div className="crex-container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-4xl uppercase">CREX</p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Live scores, predictive analytics, and fantasy intelligence built for every IPL night.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Navigation</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/">Home</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/players">Players</Link>
            <Link href="/analytics">Analytics</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Social</h3>
          <div className="mt-4 flex items-center gap-3">
            <Link href="https://x.com" className="rounded-2xl border border-white/10 p-3 text-white/80 hover:bg-white/10">
              <Twitter size={18} />
            </Link>
            <Link href="https://instagram.com" className="rounded-2xl border border-white/10 p-3 text-white/80 hover:bg-white/10">
              <Instagram size={18} />
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Newsletter</h3>
          <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-[48px] rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/40"
            />
            <button type="submit" className="tap-target rounded-2xl bg-crex-accent px-4 py-3 text-sm font-semibold text-white">
              Subscribe
            </button>
            <p className="text-xs leading-5 text-white/60">{message}</p>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2025 CREX. Not affiliated with BCCI or IPL.
      </div>
    </footer>
  );
}

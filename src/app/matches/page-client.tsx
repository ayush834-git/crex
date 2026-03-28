"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertBanner } from "@/components/ui/alert-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { MatchTabs } from "@/components/ui/match-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { LiveMatchCard } from "@/components/sections/live-match-card";
import { useMatches } from "@/hooks/useMatches";

const PAGE_SIZE = 12;

export function MatchesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const live = useMatches("live");
  const recent = useMatches("completed");
  const upcoming = useMatches("upcoming");
  const defaultTab = live.matches.length ? "live" : "upcoming";
  const [page, setPage] = useState(1);

  const activeTab = searchParams.get("tab") ?? defaultTab;
  const activeMatches = activeTab === "live" ? live.matches : activeTab === "recent" ? recent.matches : upcoming.matches;
  const totalPages = Math.max(1, Math.ceil(activeMatches.length / PAGE_SIZE));
  const pageMatches = useMemo(() => activeMatches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [activeMatches, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  return (
    <>
      {live.matches.length ? (
        <AlertBanner
          message={`${live.matches[0].team1.abbr} vs ${live.matches[0].team2.abbr} is live — ${live.matches[0].note ?? "Follow the pressure swing now."}`}
          cta={{ text: "Stay on Live", href: "/matches?tab=live" }}
          dismissible={false}
        />
      ) : null}
      <PageHeader
        title="Match Center"
        subtitle="Live, recent, and upcoming IPL fixtures with score context, venue intelligence, and friendly fallbacks."
        eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
        tone="yellow"
      />
      <section className="crex-section">
        <div className="crex-container">
          <MatchTabs active={activeTab} onChange={(tab) => router.replace(`/matches?tab=${tab}`)} />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageMatches.length ? (
              pageMatches.map((match) => <LiveMatchCard key={match.id} match={match} />)
            ) : (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState
                  title={activeTab === "live" ? "No live matches right now" : "No matches in this tab"}
                  subtitle="Check back at match time or switch to a different tab to keep browsing fixtures."
                  cta={{ text: activeTab === "live" ? "Upcoming Matches" : "Back to Live", href: activeTab === "live" ? "/matches?tab=upcoming" : "/matches?tab=live" }}
                />
              </div>
            )}
          </div>
          <Pagination className="mt-8" page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </>
  );
}

"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { PlayerFiltersBar } from "@/components/sections/player-filters";
import { PlayerGrid } from "@/components/sections/player-grid";
import { usePlayers, type PlayerFilters } from "@/hooks/usePlayers";

export function PlayersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo<PlayerFilters>(
    () => ({
      query: searchParams.get("search") ?? "",
      team: searchParams.get("team")?.split(",").filter(Boolean) ?? [],
      role: searchParams.get("role")?.split(",").filter(Boolean) ?? [],
      nationality: searchParams.get("nationality")?.split(",").filter(Boolean) ?? [],
      page: Number(searchParams.get("page") ?? "1"),
      limit: 20,
    }),
    [searchParams]
  );

  const { players, total, loading, source } = usePlayers(filters);
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const pushFilters = (next: PlayerFilters) => {
    const params = new URLSearchParams();
    if (next.query) params.set("search", next.query);
    if (next.team?.length) params.set("team", next.team.join(","));
    if (next.role?.length) params.set("role", next.role.join(","));
    if (next.nationality?.length) params.set("nationality", next.nationality.join(","));
    params.set("page", String(next.page ?? 1));
    router.replace(`/players?${params.toString()}`);
  };

  return (
    <>
      <PageHeader
        title="IPL Players 2026"
        subtitle="Search by team, role, and nationality. CREX always keeps a fully populated player grid even when live APIs are delayed."
        eyebrow={source === "static" ? "Showing stable fallback roster" : "Live roster sync"}
      />
      <section className="crex-section">
        <div className="crex-container">
          <PlayerFiltersBar filters={filters} onChange={pushFilters} />
          <div className="mt-8">
            <PlayerGrid players={players} loading={loading} />
          </div>
          <Pagination className="mt-8" page={filters.page ?? 1} totalPages={totalPages} onPageChange={(page) => pushFilters({ ...filters, page })} />
        </div>
      </section>
    </>
  );
}

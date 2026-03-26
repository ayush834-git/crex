import { cn } from "@/utils/cn";

interface ComparisonRow {
  metric: string;
  player1: string | number;
  player2: string | number;
  winner: "player1" | "player2" | "tie";
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
  player1Name: string;
  player2Name: string;
  className?: string;
}

export function ComparisonTable({ rows, player1Name, player2Name, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-crex-border bg-white shadow-crex", className)}>
      <table className="min-w-full divide-y divide-crex-border">
        <thead className="bg-crex-surface">
          <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-crex-muted">
            <th className="px-4 py-3">Metric</th>
            <th className="px-4 py-3">{player1Name}</th>
            <th className="px-4 py-3">{player2Name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-crex-border text-sm text-crex-text">
          {rows.map((row) => (
            <tr key={row.metric}>
              <td className="px-4 py-4 font-semibold">{row.metric}</td>
              <td className={cn("px-4 py-4", row.winner === "player1" ? "border-l-2 border-crex-accent bg-crex-accent/10 font-semibold" : "")}>
                {row.player1}
              </td>
              <td className={cn("px-4 py-4", row.winner === "player2" ? "border-l-2 border-crex-accent bg-crex-accent/10 font-semibold" : "")}>
                {row.player2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

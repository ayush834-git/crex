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
    <div className={cn("overflow-hidden rounded-2xl border-2 border-crex-border bg-crex-panel shadow-[0_18px_32px_rgba(91,33,182,0.18)]", className)}>
      <table className="min-w-full border-collapse">
        <thead className="bg-[linear-gradient(135deg,rgba(234,179,8,0.75),rgba(250,204,21,0.92))]">
          <tr className="text-left font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">
            <th className="px-4 py-3">Metric</th>
            <th className="px-4 py-3">{player1Name}</th>
            <th className="px-4 py-3">{player2Name}</th>
          </tr>
        </thead>
        <tbody className="text-lg uppercase text-crex-text">
          {rows.map((row) => (
            <tr key={row.metric} className="border-t-2 border-[rgba(91,33,182,0.12)]">
              <td className="px-4 py-4 font-display text-2xl tracking-[0.06em] text-crex-accent">{row.metric}</td>
              <td className={cn("px-4 py-4 font-mono text-xl", row.winner === "player1" ? "bg-crex-accent text-white" : "")}>
                {row.player1}
              </td>
              <td className={cn("px-4 py-4 font-mono text-xl", row.winner === "player2" ? "bg-crex-accent-soft text-white" : "")}>
                {row.player2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

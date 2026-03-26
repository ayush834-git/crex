export function CREXSpinner() {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-crex-muted">
      <span className="h-3 w-3 rounded-full bg-crex-accent animate-live-pulse" />
      Loading
    </div>
  );
}

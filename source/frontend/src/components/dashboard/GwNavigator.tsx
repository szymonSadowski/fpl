import { ChevronLeft, ChevronRight } from 'lucide-react';

type GwNavigatorProps = {
  gw: number;
  currentGw: number;
  onGwChange: (gw: number) => void;
};

export function GwNavigator({ gw, currentGw, onGwChange }: GwNavigatorProps) {
  const isPast = gw < currentGw;
  const isFuture = gw > currentGw;

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={gw <= 1}
        onClick={() => onGwChange(gw - 1)}
        className="p-1.5 rounded-lg border border-border bg-bg-card hover:bg-bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 min-w-[140px] justify-center">
        <span className="font-display tracking-wider text-sm">
          Gameweek {gw}
        </span>
        {isPast && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-text-muted/20 text-text-muted uppercase tracking-wider">
            past
          </span>
        )}
        {isFuture && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fpl-grass/20 text-fpl-grass uppercase tracking-wider">
            future
          </span>
        )}
        {!isPast && !isFuture && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fpl-gold/20 text-fpl-gold uppercase tracking-wider">
            live
          </span>
        )}
      </div>

      <button
        disabled={gw >= 38}
        onClick={() => onGwChange(gw + 1)}
        className="p-1.5 rounded-lg border border-border bg-bg-card hover:bg-bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

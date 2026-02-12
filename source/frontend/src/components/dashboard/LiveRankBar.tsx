import { Trophy, ArrowUp, ArrowDown, Minus, Zap } from 'lucide-react';

const CHIP_LABELS: Record<string, { label: string; color: string }> = {
  bboost: { label: 'Bench Boost', color: 'text-blue-400 border-blue-500/40 bg-blue-500/20' },
  '3xc': { label: 'Triple Captain', color: 'text-fpl-gold border-fpl-gold/40 bg-fpl-gold/20' },
  wildcard: { label: 'Wildcard', color: 'text-purple-400 border-purple-500/40 bg-purple-500/20' },
  freehit: { label: 'Free Hit', color: 'text-orange-400 border-orange-500/40 bg-orange-500/20' },
};

type LiveRankBarProps = {
  totalPoints: number;
  overallRank: number;
  rankDelta: number | null;
  gwRank: number | null;
  activeChip: string | null;
  mode: 'past' | 'current';
};

function fmt(n: number) {
  return n.toLocaleString();
}

function RankDelta({ delta }: { delta: number | null }) {
  if (delta === null || delta === 0) {
    return (
      <span className="flex items-center gap-0.5 text-text-muted">
        <Minus className="w-3 h-3" />
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="flex items-center gap-0.5 text-green-400">
        <ArrowUp className="w-3 h-3" />
        <span className="text-xs">{fmt(delta)}</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-red-400">
      <ArrowDown className="w-3 h-3" />
      <span className="text-xs">{fmt(Math.abs(delta))}</span>
    </span>
  );
}

export function LiveRankBar({ totalPoints, overallRank, rankDelta, gwRank, activeChip, mode }: LiveRankBarProps) {
  const chip = activeChip ? CHIP_LABELS[activeChip] : null;

  return (
    <div className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl glass border border-border flex-wrap">
      {mode === 'current' && (
        <>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-fpl-gold" />
            <span className="text-text-muted text-sm">Live Pts</span>
            <span className="font-semibold text-sm">{totalPoints}</span>
          </div>
          <span className="text-border">|</span>
        </>
      )}

      <div className="flex items-center gap-2">
        <span className="text-text-muted text-sm">Overall Rank</span>
        <span className="font-semibold text-sm">{fmt(overallRank)}</span>
        <RankDelta delta={rankDelta} />
      </div>

      <span className="text-border">|</span>

      <div className="flex items-center gap-2">
        <span className="text-text-muted text-sm">GW Rank</span>
        <span className="font-semibold text-sm">{gwRank !== null ? fmt(gwRank) : '—'}</span>
      </div>

      {chip && (
        <>
          <span className="text-border">|</span>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${chip.color}`}>
            <Zap className="w-3 h-3" />
            {chip.label} Active
          </div>
        </>
      )}
    </div>
  );
}

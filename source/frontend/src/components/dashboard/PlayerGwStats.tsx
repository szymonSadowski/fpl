import { useMemo } from 'react';
import { useEventLive } from '../../hooks/useBootstrap';
import type { EnrichedPick, LiveElementStats } from '../../types/api';

const STAT_COLS: { key: keyof LiveElementStats; label: string }[] = [
  { key: 'goals_scored', label: 'G' },
  { key: 'assists', label: 'A' },
  { key: 'clean_sheets', label: 'CS' },
  { key: 'defensive_contribution', label: 'DC' },
  { key: 'bonus', label: 'BNS' },
  { key: 'bps', label: 'BPS' },
];

// DEFCON thresholds per position: posId → DC needed for 2 pts (GK can't earn)
const DEFCON_THRESHOLD: Record<number, number> = { 2: 10, 3: 12, 4: 12 };

function calcDefconPts(posId: number, dc: number): number {
  const threshold = DEFCON_THRESHOLD[posId];
  if (!threshold) return 0; // GK (1) can't earn
  return Math.floor(dc / threshold) * 2;
}

type PlayerGwStatsProps = {
  picks: EnrichedPick[];
  gw: number;
  activeChip?: string | null;
};

export function PlayerGwStats({ picks, gw, activeChip }: PlayerGwStatsProps) {
  const { data: live } = useEventLive(gw);

  const liveMap = useMemo(
    () => new Map(live?.elements.map((el) => [el.id, el.stats]) ?? []),
    [live],
  );

  const isBenchBoost = activeChip === 'bboost';

  // Rows: starters always, bench players if bench boost or they have minutes
  const rows = useMemo(() => {
    return picks
      .filter((p) => {
        if (p.position <= 11 || isBenchBoost) return true;
        const st = liveMap.get(p.element);
        return st && st.minutes > 0;
      })
      .sort((a, b) => a.position - b.position);
  }, [picks, liveMap, isBenchBoost]);

  // Combined totals for featured players
  const featuredPicks = picks.filter((p) => isBenchBoost || p.position <= 11);
  const totals = useMemo(() => {
    const sums: Record<string, number> = {};
    STAT_COLS.forEach((c) => (sums[c.key] = 0));
    let totalPts = 0;
    let totalDefcon = 0;
    featuredPicks.forEach((p) => {
      const st = liveMap.get(p.element);
      if (!st) return;
      STAT_COLS.forEach((c) => (sums[c.key] += Number(st[c.key]) || 0));
      totalPts += st.total_points * (p.multiplier || 1);
      totalDefcon += calcDefconPts(p.playerPosition.id, st.defensive_contribution);
    });
    return { ...sums, pts: totalPts, defcon: totalDefcon };
  }, [featuredPicks, liveMap]);

  if (!live || rows.length === 0) return null;

  // Don't render if nobody has played yet
  const anyMinutes = rows.some((p) => {
    const st = liveMap.get(p.element);
    return st && st.minutes > 0;
  });
  if (!anyMinutes) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-display tracking-wide text-text-muted uppercase mb-3">
        My Squad GW{gw} Stats
      </h4>

      {/* Combined totals bar */}
      <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg bg-bg-dark border border-border">
        <span className="text-xs text-text-muted uppercase tracking-wide mr-auto">
          Combined{isBenchBoost ? ' (BB)' : ''}
        </span>
        <TotalCell label="PTS" value={totals.pts} />
        {STAT_COLS.map((c) => (
          <TotalCell key={c.key} label={c.label} value={totals[c.key]} />
        ))}
        <TotalCell label="DEFCON" value={totals.defcon} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs">
              <th className="text-left py-2 pr-4 font-medium">Player</th>
              <th className="text-center py-2 px-2 font-medium w-12">PTS</th>
              {STAT_COLS.map((c) => (
                <th key={c.key} className="text-center py-2 px-2 font-medium w-12">
                  {c.label}
                </th>
              ))}
              <th className="text-center py-2 px-2 font-medium w-14">DEFCON</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((pick) => {
              const st = liveMap.get(pick.element);
              const isBench = pick.position > 11;
              const noMinutes = !st || st.minutes === 0;
              const pts = (st?.total_points ?? 0) * (pick.multiplier || 1);
              const dc = st?.defensive_contribution ?? 0;
              const defconPts = calcDefconPts(pick.playerPosition.id, dc);
              const threshold = DEFCON_THRESHOLD[pick.playerPosition.id];
              return (
                <tr
                  key={pick.element}
                  className={`border-b border-border/50 ${(isBench && !isBenchBoost) || noMinutes ? 'opacity-50' : ''}`}
                >
                  <td className="py-1.5 pr-4">
                    <span className="font-medium">{pick.webName}</span>
                    <span className="text-text-muted text-xs ml-1.5">
                      {pick.team.shortName}
                    </span>
                    {pick.isCaptain && (
                      <span className="ml-1 text-[10px] font-bold text-fpl-gold">C</span>
                    )}
                  </td>
                  <StatCell value={pts} highlight />
                  {STAT_COLS.map((c) => (
                    <StatCell key={c.key} value={Number(st?.[c.key]) || 0} />
                  ))}
                  <td className="text-center py-1.5 px-2 tabular-nums">
                    {threshold ? (
                      <span className={defconPts > 0 ? 'text-green-400 font-medium' : 'text-text-muted'}>
                        {defconPts > 0 ? `+${defconPts}` : `${dc}/${threshold}`}
                      </span>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TotalCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center min-w-[2.5rem]">
      <div className="text-[10px] text-text-muted">{label}</div>
      <div className={`text-sm tabular-nums font-bold ${value > 0 ? 'text-text-primary' : 'text-text-muted'}`}>
        {value}
      </div>
    </div>
  );
}

function StatCell({ value, highlight }: { value: number; highlight?: boolean }) {
  return (
    <td className={`text-center py-1.5 px-2 tabular-nums ${
      value > 0
        ? highlight ? 'text-text-primary font-bold' : 'text-text-primary font-medium'
        : 'text-text-muted'
    }`}>
      {value}
    </td>
  );
}

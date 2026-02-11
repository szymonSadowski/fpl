import { useMemo } from 'react';
import { useGwFixtures, usePlayers } from '../../hooks/useBootstrap';
import type { EnrichedFixture, EnrichedPlayer } from '../../types/api';

const STAT_LABELS: Record<string, string> = {
  goals_scored: 'Goals',
  assists: 'Assists',
  bonus: 'Bonus',
  bps: 'BPS',
};

const STAT_DISPLAY_ORDER = ['goals_scored', 'assists', 'bonus', 'bps'];

const FDR_COLORS: Record<number, string> = {
  1: 'bg-green-600 text-white',
  2: 'bg-green-500 text-white',
  3: 'bg-gray-500 text-white',
  4: 'bg-red-500 text-white',
  5: 'bg-red-700 text-white',
};

type GwFixturesProps = {
  gw: number;
};

export function GwFixtures({ gw }: GwFixturesProps) {
  const { data: fixtures } = useGwFixtures(gw);
  const { data: players } = usePlayers();

  const playerMap = useMemo(
    () => new Map(players?.map((p) => [p.id, p]) ?? []),
    [players],
  );

  if (!fixtures || fixtures.length === 0) return null;

  return (
    <div className="mt-8">
      <h4 className="text-sm font-display tracking-wide text-text-muted uppercase mb-3">
        GW{gw} Fixtures
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {fixtures.map((fix) => (
          <FixtureCard key={fix.id} fixture={fix} playerMap={playerMap} />
        ))}
      </div>
    </div>
  );
}

function FixtureCard({
  fixture: fix,
  playerMap,
}: {
  fixture: EnrichedFixture;
  playerMap: Map<number, EnrichedPlayer>;
}) {
  const hasStats = fix.started && fix.stats && fix.stats.length > 0;

  return (
    <div className="rounded-lg bg-bg-dark border border-border p-3">
      {/* Score line */}
      <div className="flex items-center justify-between gap-2">
        <TeamBadge name={fix.homeTeam.shortName} fdr={fix.homeDifficulty} />
        <div className="text-center">
          {fix.started ? (
            <span className="text-lg font-bold tabular-nums">
              {fix.homeScore ?? 0} - {fix.awayScore ?? 0}
            </span>
          ) : (
            <span className="text-xs text-text-muted">
              {fix.kickoffTime
                ? new Date(fix.kickoffTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'TBD'}
            </span>
          )}
          {fix.finished && (
            <div className="text-[10px] text-text-muted uppercase">FT</div>
          )}
        </div>
        <TeamBadge name={fix.awayTeam.shortName} fdr={fix.awayDifficulty} />
      </div>

      {/* Stat details for started fixtures */}
      {hasStats && (
        <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
          {STAT_DISPLAY_ORDER.map((statId) => {
            const stat = fix.stats.find((s) => s.identifier === statId);
            if (!stat || (stat.h.length === 0 && stat.a.length === 0)) return null;
            return (
              <StatRow
                key={statId}
                label={STAT_LABELS[statId]}
                homePlayers={stat.h}
                awayPlayers={stat.a}
                playerMap={playerMap}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamBadge({ name, fdr }: { name: string; fdr: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center ${FDR_COLORS[fdr] ?? 'bg-gray-500 text-white'}`}>
        {fdr}
      </span>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

function StatRow({
  label,
  homePlayers,
  awayPlayers,
  playerMap,
}: {
  label: string;
  homePlayers: { value: number; element: number }[];
  awayPlayers: { value: number; element: number }[];
  playerMap: Map<number, EnrichedPlayer>;
}) {
  const formatEntries = (entries: { value: number; element: number }[]) =>
    entries
      .map((e) => {
        const name = playerMap.get(e.element)?.webName ?? `#${e.element}`;
        return e.value > 1 ? `${name} (${e.value})` : name;
      })
      .join(', ');

  const homeStr = formatEntries(homePlayers);
  const awayStr = formatEntries(awayPlayers);

  return (
    <div className="flex items-start text-xs gap-2">
      <span className="text-text-muted w-12 shrink-0">{label}</span>
      <span className="flex-1 text-right truncate">{homeStr || '-'}</span>
      <span className="text-text-muted">|</span>
      <span className="flex-1 truncate">{awayStr || '-'}</span>
    </div>
  );
}

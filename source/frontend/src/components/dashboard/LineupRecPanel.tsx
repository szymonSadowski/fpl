import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Loader } from '../ui/loader';
import { useLineupRecs } from '../../hooks/useRecommendations';
import { usePlayers } from '../../hooks/useBootstrap';
import type { EnrichedPlayer, LineupRecommendation } from '../../types/api';
import { Trophy } from 'lucide-react';

type LineupRecPanelProps = {
  teamId: number;
  gw: number;
  currentGw: number;
};

export function LineupRecPanel({ teamId, gw, currentGw }: LineupRecPanelProps) {
  const event = gw !== currentGw ? gw : undefined;
  const { data: lineup, isLoading, isError } = useLineupRecs(teamId, event);
  const { data: players } = usePlayers();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !lineup) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-text-secondary text-sm">
          Failed to load lineup recommendations
        </CardContent>
      </Card>
    );
  }

  const playerMap = new Map(players?.map((p) => [p.id, p]) ?? []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">OPTIMAL LINEUP</CardTitle>
          <span className="text-xs px-2 py-1 rounded-full bg-bg-dark border border-border text-text-muted">
            {lineup.mode === 'hindsight' ? 'Hindsight' : 'Predicted'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {lineup.mode === 'hindsight' && lineup.optimalPoints != null && lineup.actualPoints != null && (
          <PointsComparison optimal={lineup.optimalPoints} actual={lineup.actualPoints} />
        )}
        <PositionGroup label="GK" ids={filterByPosition(lineup.starting, playerMap, 1)} lineup={lineup} playerMap={playerMap} />
        <Divider />
        <PositionGroup label="DEF" ids={filterByPosition(lineup.starting, playerMap, 2)} lineup={lineup} playerMap={playerMap} />
        <Divider />
        <PositionGroup label="MID" ids={filterByPosition(lineup.starting, playerMap, 3)} lineup={lineup} playerMap={playerMap} />
        <Divider />
        <PositionGroup label="FWD" ids={filterByPosition(lineup.starting, playerMap, 4)} lineup={lineup} playerMap={playerMap} />
        <div className="border-t-2 border-border my-2" />
        <div>
          <p className="text-xs text-text-muted mb-1.5">BENCH</p>
          <div className="flex flex-wrap gap-2">
            {lineup.bench.map((id) => (
              <PlayerChip key={id} id={id} lineup={lineup} playerMap={playerMap} bench />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function filterByPosition(ids: number[], playerMap: Map<number, EnrichedPlayer>, posId: number): number[] {
  return ids.filter((id) => playerMap.get(id)?.position.id === posId);
}

function PointsComparison({ optimal, actual }: { optimal: number; actual: number }) {
  const diff = optimal - actual;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark border border-border text-sm">
      <Trophy className="w-4 h-4 text-fpl-grass shrink-0" />
      <span>
        <span className="font-semibold text-fpl-grass">{optimal}</span>
        <span className="text-text-muted"> optimal</span>
      </span>
      <span className="text-text-muted">|</span>
      <span>
        <span className="font-semibold">{actual}</span>
        <span className="text-text-muted"> yours</span>
      </span>
      {diff > 0 && (
        <>
          <span className="text-text-muted">|</span>
          <span className="text-red-400 font-medium">+{diff} missed</span>
        </>
      )}
    </div>
  );
}

function PositionGroup({
  label,
  ids,
  lineup,
  playerMap,
}: {
  label: string;
  ids: number[];
  lineup: LineupRecommendation;
  playerMap: Map<number, EnrichedPlayer>;
}) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-1.5">{label}</p>
      <div className="space-y-1">
        {ids.map((id) => (
          <PlayerChip key={id} id={id} lineup={lineup} playerMap={playerMap} />
        ))}
      </div>
    </div>
  );
}

function PlayerChip({
  id,
  lineup,
  playerMap,
  bench,
}: {
  id: number;
  lineup: LineupRecommendation;
  playerMap: Map<number, EnrichedPlayer>;
  bench?: boolean;
}) {
  const player = playerMap.get(id);
  const isCaptain = lineup.captain === id;
  const isVC = lineup.viceCaptain === id;
  const reason = lineup.reasons[id];

  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-sm ${
        bench ? 'bg-bg-dark/50 border-border/50 text-text-muted' : 'bg-bg-dark border-border'
      }`}
    >
      {isCaptain && (
        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold" title="Captain">
          C
        </span>
      )}
      {isVC && (
        <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold" title="Vice Captain">
          V
        </span>
      )}
      <span className={`font-medium ${bench ? 'text-text-muted' : ''}`}>
        {player?.webName ?? `#${id}`}
      </span>
      <span className="text-xs text-text-muted/70 ml-auto">{player?.team.shortName}</span>
      {reason && <span className="text-xs text-text-muted/60 hidden lg:inline">{reason}</span>}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border/50" />;
}

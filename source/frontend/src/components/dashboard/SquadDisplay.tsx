import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PitchView } from './PitchView';
import { GwNavigator } from './GwNavigator';
import { useTeamOverview } from '../../hooks/useEntry';
import { usePlayers } from '../../hooks/useBootstrap';
import { Loader } from '../ui/loader';
import { Wallet, TrendingUp } from 'lucide-react';

type GwMode = 'past' | 'current' | 'future';

type SquadDisplayProps = {
  teamId: number;
  gw: number;
  currentGw: number;
  onGwChange: (gw: number) => void;
};

export function SquadDisplay({ teamId, gw, currentGw, onGwChange }: SquadDisplayProps) {
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useTeamOverview(teamId, gw);
  const { data: players, isLoading: playersLoading } = usePlayers();

  const mode: GwMode = gw < currentGw ? 'past' : gw > currentGw ? 'future' : 'current';

  if (overviewLoading || playersLoading) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-20">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (overviewError || !overview) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-20 text-center text-text-secondary">
          Failed to load team data
        </CardContent>
      </Card>
    );
  }

  const playerMap = new Map(players?.map((p) => [p.id, p]) ?? []);

  const totalPoints = overview.picks.reduce((sum, pick) => {
    if (pick.gwPoints !== undefined) {
      return sum + pick.gwPoints * pick.multiplier;
    }
    const player = playerMap.get(pick.element);
    return sum + (player?.eventPoints || 0) * pick.multiplier;
  }, 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>MY SQUAD</CardTitle>
            <div className="flex items-center gap-3 text-sm">
              {mode !== 'future' && (
                <StatPill icon={<TrendingUp className="w-4 h-4" />} label="GW Pts" value={totalPoints.toString()} />
              )}
              <StatPill icon={<Wallet className="w-4 h-4" />} label="Bank" value={formatPrice(overview.bank)} />
              <StatPill icon={<Wallet className="w-4 h-4" />} label="Value" value={formatPrice(overview.value)} />
            </div>
          </div>
          <GwNavigator gw={gw} currentGw={currentGw} onGwChange={onGwChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="pb-48">
          <PitchView picks={overview.picks} mode={mode} gw={gw} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-dark border border-border">
      <span className="text-fpl-grass">{icon}</span>
      <span className="text-text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

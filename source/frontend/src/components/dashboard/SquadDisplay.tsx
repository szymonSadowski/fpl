import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PitchView } from './PitchView';
import { useTeamOverview } from '../../hooks/useEntry';
import { usePlayers } from '../../hooks/useBootstrap';
import { Loader } from '../ui/loader';
import { Wallet, TrendingUp } from 'lucide-react';

type SquadDisplayProps = {
  teamId: number;
};

export function SquadDisplay({ teamId }: SquadDisplayProps) {
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useTeamOverview(teamId);
  const { data: players, isLoading: playersLoading } = usePlayers();

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
    const player = playerMap.get(pick.element);
    return sum + (player?.eventPoints || 0) * pick.multiplier;
  }, 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>MY SQUAD</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <StatPill icon={<TrendingUp className="w-4 h-4" />} label="GW Points" value={totalPoints.toString()} />
          <StatPill icon={<Wallet className="w-4 h-4" />} label="Bank" value={formatPrice(overview.bank)} />
          <StatPill icon={<Wallet className="w-4 h-4" />} label="Value" value={formatPrice(overview.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="pb-48">
          <PitchView picks={overview.picks} />
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

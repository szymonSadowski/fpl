import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PitchView } from './PitchView';
import { useEntryPicks } from '../../hooks/useEntry';
import { useEvents, usePlayers } from '../../hooks/useBootstrap';
import { Loader } from '../ui/loader';
import { Wallet, TrendingUp } from 'lucide-react';

type SquadDisplayProps = {
  teamId: number;
};

export function SquadDisplay({ teamId }: SquadDisplayProps) {
  const { data: events, isLoading: eventsLoading, isError: eventsError } = useEvents();
  const { data: players, isLoading: playersLoading } = usePlayers();
  const currentEvent = events?.find((e) => e.is_current);
  const { data: entryPicks, isLoading: picksLoading, isError: picksError } = useEntryPicks(teamId, currentEvent?.id);

  if (eventsLoading || playersLoading || picksLoading || !currentEvent) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-20">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (eventsError) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-20 text-center text-text-secondary">
          Failed to load FPL data
        </CardContent>
      </Card>
    );
  }

  if (picksError || !entryPicks) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-20 text-center text-text-secondary">
          Failed to load team data
        </CardContent>
      </Card>
    );
  }

  const totalPoints = entryPicks.picks.reduce((sum, pick) => {
    const player = players?.find((p) => p.id === pick.element);
    return sum + (player?.event_points || 0) * pick.multiplier;
  }, 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>MY SQUAD</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <StatPill icon={<TrendingUp className="w-4 h-4" />} label="GW Points" value={totalPoints.toString()} />
          <StatPill icon={<Wallet className="w-4 h-4" />} label="Value" value={formatPrice(entryPicks.entry_history.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="pb-24">
          <PitchView picks={entryPicks.picks} />
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

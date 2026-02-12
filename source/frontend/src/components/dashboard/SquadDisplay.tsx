import { useState } from 'react';
import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PitchView } from './PitchView';
import { GwNavigator } from './GwNavigator';
import { PlayerGwStats } from './PlayerGwStats';
import { GwFixtures } from './GwFixtures';
import { PlayerDetailModal } from './PlayerDetailModal';
import { useTeamOverview } from '../../hooks/useEntry';
import { usePlayers } from '../../hooks/useBootstrap';
import { Loader } from '../ui/loader';
import { Wallet, TrendingUp } from 'lucide-react';

const CHIP_META: Record<string, { label: string; color: string }> = {
  bboost: { label: 'Bench Boost', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  '3xc': { label: 'Triple Captain', color: 'bg-fpl-gold/20 text-fpl-gold border-fpl-gold/40' },
  wildcard: { label: 'Wildcard', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  freehit: { label: 'Free Hit', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
};

type GwMode = 'past' | 'current' | 'future';

type SquadDisplayProps = {
  teamId: number;
  gw: number;
  currentGw: number;
  onGwChange: (gw: number) => void;
};

export function SquadDisplay({ teamId, gw, currentGw, onGwChange }: SquadDisplayProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
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
        {/* Available chips for current/future GWs */}
        {mode !== 'past' && !overview.activeChip && overview.availableChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-text-muted">Available:</span>
            {overview.availableChips.map((chip) => {
              const meta = CHIP_META[chip];
              return meta ? (
                <span key={chip} className={`px-2 py-0.5 rounded-full border opacity-60 ${meta.color}`}>
                  {meta.label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="pb-48">
          <PitchView picks={overview.picks} mode={mode} gw={gw} activeChip={overview.activeChip} onPlayerClick={setSelectedPlayerId} />
        </div>
        {mode !== 'future' && (
          <>
            <PlayerGwStats picks={overview.picks} gw={gw} activeChip={overview.activeChip} />
            <GwFixtures gw={gw} />
          </>
        )}
      </CardContent>
      <PlayerDetailModal
        playerId={selectedPlayerId}
        purchasePrice={overview.picks.find((p) => p.element === selectedPlayerId)?.purchasePrice}
        onClose={() => setSelectedPlayerId(null)}
      />
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

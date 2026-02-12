import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Loader } from '../ui/loader';
import { useTeamOverview } from '../../hooks/useEntry';
import { Zap, Crown, Shuffle, ArrowRightLeft, Check, Circle } from 'lucide-react';

const CHIPS = [
  { key: 'wildcard', label: 'Wildcard', icon: Shuffle, accent: 'bg-purple-500/15 text-purple-400 border-purple-500/30', ring: 'ring-purple-500/40' },
  { key: 'freehit', label: 'Free Hit', icon: ArrowRightLeft, accent: 'bg-orange-500/15 text-orange-400 border-orange-500/30', ring: 'ring-orange-500/40' },
  { key: '3xc', label: 'Triple Captain', icon: Crown, accent: 'bg-fpl-gold/15 text-fpl-gold border-fpl-gold/30', ring: 'ring-fpl-gold/40' },
  { key: 'bboost', label: 'Bench Boost', icon: Zap, accent: 'bg-blue-500/15 text-blue-400 border-blue-500/30', ring: 'ring-blue-500/40' },
] as const;

type ChipsCardProps = {
  teamId: number;
  gw: number;
};

export function ChipsCard({ teamId, gw }: ChipsCardProps) {
  const { data: overview, isLoading } = useTeamOverview(teamId, gw);

  const { usageMap, halfLabel } = useMemo(() => {
    const fhe = overview?.firstHalfEnd ?? 19;
    const isFirstHalf = gw <= fhe;
    const map = new Map<string, number>();
    for (const c of overview?.chipUsage ?? []) {
      const inH1 = c.event <= fhe;
      if (isFirstHalf === inH1) map.set(c.name, c.event);
    }
    return {
      usageMap: map,
      halfLabel: isFirstHalf ? `First Half (GW 1–${fhe})` : `Second Half (GW ${fhe + 1}–38)`,
    };
  }, [overview, gw]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!overview) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">CHIPS</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-text-muted mb-2 tracking-wide">{halfLabel}</p>
        <div className="space-y-1.5">
          {CHIPS.map(({ key, label: chipLabel, icon: Icon, accent, ring }) => {
            const usedGw = usageMap.get(key);
            const used = usedGw !== undefined;
            const activeHere = overview.activeChip === key && usedGw === gw;

            return (
              <div
                key={key}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border text-sm transition-all duration-200 ${
                  activeHere
                    ? `${accent} ring-1 ${ring}`
                    : used
                      ? 'bg-bg-dark/40 border-border/40 opacity-50'
                      : 'bg-bg-dark/60 border-border/60 hover:border-border'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  activeHere ? accent : used ? 'bg-bg-dark border border-border' : accent
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className={`font-medium flex-1 text-xs ${used && !activeHere ? 'line-through text-text-muted' : ''}`}>
                  {chipLabel}
                </span>
                {activeHere ? (
                  <span className="text-[11px] font-medium">Active</span>
                ) : used ? (
                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                    <Check className="w-3 h-3" /> GW{usedGw}
                  </span>
                ) : (
                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                    <Circle className="w-3 h-3" /> Available
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

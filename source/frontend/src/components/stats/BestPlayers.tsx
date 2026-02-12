import { useState, useMemo } from 'react';
import { usePlayers } from '../../hooks/useBootstrap';
import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Loader } from '../ui/loader';
import type { EnrichedPlayer } from '../../types/api';

const POSITIONS = [
  { id: 0, label: 'ALL' },
  { id: 1, label: 'GK' },
  { id: 2, label: 'DEF' },
  { id: 3, label: 'MID' },
  { id: 4, label: 'FWD' },
];

const POS_SHORT: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' };

type SortKey = 'points' | 'form' | 'goals' | 'xG' | 'cost' | 'selectedByPercent';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'points', label: 'Points' },
  { key: 'form', label: 'Form' },
  { key: 'goals', label: 'Goals' },
  { key: 'xG', label: 'xG' },
  { key: 'cost', label: 'Cost' },
  { key: 'selectedByPercent', label: 'Selected%' },
];

function getSortValue(player: EnrichedPlayer, key: SortKey): number {
  switch (key) {
    case 'points': return player.points;
    case 'form': return parseFloat(player.form) || 0;
    case 'goals': return player.goals;
    case 'xG': return parseFloat(player.xG) || 0;
    case 'cost': return player.cost;
    case 'selectedByPercent': return parseFloat(player.selectedByPercent) || 0;
  }
}

export function BestPlayers() {
  const { data: players, isLoading, isError } = usePlayers();
  const [posFilter, setPosFilter] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('points');

  const filtered = useMemo(() => {
    if (!players) return [];
    let list = posFilter === 0 ? players : players.filter((p) => p.position.id === posFilter);
    return [...list]
      .sort((a, b) => getSortValue(b, sortKey) - getSortValue(a, sortKey))
      .slice(0, 20);
  }, [players, posFilter, sortKey]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !players) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-text-secondary">
          Failed to load players
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>BEST PLAYERS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position filter */}
        <div className="flex gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setPosFilter(pos.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                posFilter === pos.id
                  ? 'bg-fpl-grass text-bg-dark'
                  : 'bg-bg-dark text-text-muted hover:text-text-primary border border-border'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        {/* Sort options */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-text-muted self-center">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                sortKey === opt.key
                  ? 'bg-fpl-grass/20 text-fpl-grass'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-left py-2 px-2">Pos</th>
                <th className="text-left py-2 px-2">Name</th>
                <th className="text-left py-2 px-2">Team</th>
                <th className="text-center py-2 px-2">Pts</th>
                <th className="text-center py-2 px-2">Form</th>
                <th className="text-center py-2 px-2">Goals</th>
                <th className="text-center py-2 px-2">Ast</th>
                <th className="text-center py-2 px-2">xG</th>
                <th className="text-center py-2 px-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-bg-card-hover transition-colors">
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-medium bg-fpl-pitch/50 text-fpl-grass">
                      {POS_SHORT[p.position.id] ?? p.position.name}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-medium">{p.webName}</td>
                  <td className="py-2 px-2 text-text-secondary">{p.team.shortName}</td>
                  <td className="py-2 px-2 text-center font-bold text-fpl-grass">{p.points}</td>
                  <td className="py-2 px-2 text-center">{p.form}</td>
                  <td className="py-2 px-2 text-center">{p.goals}</td>
                  <td className="py-2 px-2 text-center">{p.assists}</td>
                  <td className="py-2 px-2 text-center">{p.xG}</td>
                  <td className="py-2 px-2 text-center">{formatPrice(p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

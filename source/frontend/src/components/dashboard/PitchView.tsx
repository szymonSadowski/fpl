import { useMemo } from 'react';
import { PlayerCard } from './PlayerCard';
import { usePlayers } from '../../hooks/useBootstrap';
import type { Pick, Player } from '../../types/api';

type PitchViewProps = {
  picks: Array<Pick>;
};

export function PitchView({ picks }: PitchViewProps) {
  const { data: players } = usePlayers();

  const { starters, bench, playerMap } = useMemo(() => {
    const playerMap = new Map<number, Player>();
    players?.forEach((p) => playerMap.set(p.id, p));

    const sortedPicks = [...picks].sort((a, b) => a.position - b.position);
    const starters = sortedPicks.filter((p) => p.position <= 11);
    const bench = sortedPicks.filter((p) => p.position > 11);

    return { starters, bench, playerMap };
  }, [picks, players]);

  const formation = useMemo(() => {
    const gk: Array<Pick> = [];
    const def: Array<Pick> = [];
    const mid: Array<Pick> = [];
    const fwd: Array<Pick> = [];

    starters.forEach((pick) => {
      const player = playerMap.get(pick.element);
      if (!player) return;
      switch (player.element_type) {
        case 1: gk.push(pick); break;
        case 2: def.push(pick); break;
        case 3: mid.push(pick); break;
        case 4: fwd.push(pick); break;
      }
    });

    return { gk, def, mid, fwd };
  }, [starters, playerMap]);

  if (!players) return null;

  return (
    <div className="relative w-full aspect-[3/4] max-w-lg mx-auto">
      {/* Pitch SVG Background */}
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a472a" />
            <stop offset="50%" stopColor="#2d5a3d" />
            <stop offset="100%" stopColor="#1a472a" />
          </linearGradient>
        </defs>
        {/* Pitch background */}
        <rect x="0" y="0" width="300" height="400" fill="url(#pitchGradient)" rx="8" />
        {/* Pitch lines */}
        <g stroke="#3d7a50" strokeWidth="1.5" fill="none">
          {/* Outer boundary */}
          <rect x="10" y="10" width="280" height="380" rx="4" />
          {/* Center line */}
          <line x1="10" y1="200" x2="290" y2="200" />
          {/* Center circle */}
          <circle cx="150" cy="200" r="40" />
          <circle cx="150" cy="200" r="2" fill="#3d7a50" />
          {/* Top penalty area */}
          <rect x="70" y="10" width="160" height="60" />
          <rect x="100" y="10" width="100" height="30" />
          <circle cx="150" cy="55" r="2" fill="#3d7a50" />
          {/* Bottom penalty area */}
          <rect x="70" y="330" width="160" height="60" />
          <rect x="100" y="360" width="100" height="30" />
          <circle cx="150" cy="345" r="2" fill="#3d7a50" />
        </g>
      </svg>

      {/* Players overlay */}
      <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
        {/* Forwards */}
        <FormationRow picks={formation.fwd} playerMap={playerMap} />
        {/* Midfielders */}
        <FormationRow picks={formation.mid} playerMap={playerMap} />
        {/* Defenders */}
        <FormationRow picks={formation.def} playerMap={playerMap} />
        {/* Goalkeeper */}
        <FormationRow picks={formation.gk} playerMap={playerMap} />
      </div>

      {/* Bench */}
      <div className="absolute -bottom-20 left-0 right-0">
        <div className="text-xs text-text-muted text-center mb-2">BENCH</div>
        <div className="flex justify-center gap-2">
          {bench.map((pick) => {
            const player = playerMap.get(pick.element);
            if (!player) return null;
            return (
              <PlayerCard
                key={pick.element}
                player={player}
                multiplier={pick.multiplier}
                sellingPrice={pick.selling_price}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FormationRow({ picks, playerMap }: { picks: Array<Pick>; playerMap: Map<number, Player> }) {
  return (
    <div className="flex justify-center gap-2">
      {picks.map((pick) => {
        const player = playerMap.get(pick.element);
        if (!player) return null;
        return (
          <PlayerCard
            key={pick.element}
            player={player}
            isCaptain={pick.is_captain}
            isViceCaptain={pick.is_vice_captain}
            multiplier={pick.multiplier}
            sellingPrice={pick.selling_price}
          />
        );
      })}
    </div>
  );
}

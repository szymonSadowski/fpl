import { useMemo } from 'react';
import { PlayerCard } from './PlayerCard';
import { usePlayers, useFixtures } from '../../hooks/useBootstrap';
import type { EnrichedPick, EnrichedPlayer, EnrichedFixture } from '../../types/api';

type GwMode = 'past' | 'current' | 'future';

type PitchViewProps = {
  picks: EnrichedPick[];
  mode: GwMode;
  gw: number;
  activeChip?: string | null;
  onPlayerClick?: (elementId: number) => void;
};

export function PitchView({ picks, mode, gw, activeChip, onPlayerClick }: PitchViewProps) {
  const { data: players } = usePlayers();
  const { data: allFixtures } = useFixtures();

  const playerMap = useMemo(() => {
    const map = new Map<number, EnrichedPlayer>();
    players?.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Build next-3-fixtures lookup per team for future mode
  const teamNextFixtures = useMemo(() => {
    if (mode !== 'future' || !allFixtures) return new Map<number, EnrichedFixture[]>();
    const map = new Map<number, EnrichedFixture[]>();
    const futureFixtures = allFixtures
      .filter((f) => f.event !== null && f.event >= gw)
      .sort((a, b) => (a.event ?? 0) - (b.event ?? 0));
    futureFixtures.forEach((f) => {
      for (const teamId of [f.homeTeam.id, f.awayTeam.id]) {
        const existing = map.get(teamId) ?? [];
        if (existing.length < 3) {
          existing.push(f);
          map.set(teamId, existing);
        }
      }
    });
    return map;
  }, [mode, gw, allFixtures]);

  const { starters, benchGk, benchOutfield } = useMemo(() => {
    const sorted = [...picks].sort((a, b) => a.position - b.position);
    const bench = sorted.filter((p) => p.position > 11);
    return {
      starters: sorted.filter((p) => p.position <= 11),
      benchGk: bench.filter((p) => p.playerPosition.id === 1),
      benchOutfield: bench.filter((p) => p.playerPosition.id !== 1),
    };
  }, [picks]);

  const formation = useMemo(() => {
    const gk: EnrichedPick[] = [];
    const def: EnrichedPick[] = [];
    const mid: EnrichedPick[] = [];
    const fwd: EnrichedPick[] = [];

    starters.forEach((pick) => {
      switch (pick.playerPosition.id) {
        case 1: gk.push(pick); break;
        case 2: def.push(pick); break;
        case 3: mid.push(pick); break;
        case 4: fwd.push(pick); break;
      }
    });

    return { gk, def, mid, fwd };
  }, [starters]);

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
        <rect x="0" y="0" width="300" height="400" fill="url(#pitchGradient)" rx="8" />
        <g stroke="#3d7a50" strokeWidth="1.5" fill="none">
          <rect x="10" y="10" width="280" height="380" rx="4" />
          <line x1="10" y1="200" x2="290" y2="200" />
          <circle cx="150" cy="200" r="40" />
          <circle cx="150" cy="200" r="2" fill="#3d7a50" />
          <rect x="70" y="10" width="160" height="60" />
          <rect x="100" y="10" width="100" height="30" />
          <circle cx="150" cy="55" r="2" fill="#3d7a50" />
          <rect x="70" y="330" width="160" height="60" />
          <rect x="100" y="360" width="100" height="30" />
          <circle cx="150" cy="345" r="2" fill="#3d7a50" />
        </g>
      </svg>

      {/* Players overlay */}
      <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
        <FormationRow picks={formation.fwd} playerMap={playerMap} mode={mode} teamNextFixtures={teamNextFixtures} activeChip={activeChip} onPlayerClick={onPlayerClick} />
        <FormationRow picks={formation.mid} playerMap={playerMap} mode={mode} teamNextFixtures={teamNextFixtures} activeChip={activeChip} onPlayerClick={onPlayerClick} />
        <FormationRow picks={formation.def} playerMap={playerMap} mode={mode} teamNextFixtures={teamNextFixtures} activeChip={activeChip} onPlayerClick={onPlayerClick} />
        <FormationRow picks={formation.gk} playerMap={playerMap} mode={mode} teamNextFixtures={teamNextFixtures} activeChip={activeChip} onPlayerClick={onPlayerClick} />
      </div>

      {/* Bench */}
      <div className="absolute -bottom-40 left-0 right-0">
        <div className={`glass rounded-xl px-4 pt-5 pb-3 relative ${activeChip === 'bboost' ? 'ring-2 ring-blue-400/60 shadow-lg shadow-blue-400/20' : ''}`}>
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 text-[14px] font-display tracking-widest text-text-muted uppercase bg-bg-card/70 backdrop-blur-sm">Substitutes</span>
          <div className="flex items-center justify-center gap-2">
            {benchGk.map((pick) => (
              <PlayerCard
                key={pick.element}
                pick={pick}
                enrichedPlayer={playerMap.get(pick.element)}
                mode={mode}
                nextFixtures={teamNextFixtures.get(pick.team.id)}
                activeChip={activeChip}
                onClick={onPlayerClick}
              />
            ))}
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-fpl-grass/40 to-transparent mx-2" />
            {benchOutfield.map((pick) => (
              <PlayerCard
                key={pick.element}
                pick={pick}
                enrichedPlayer={playerMap.get(pick.element)}
                mode={mode}
                nextFixtures={teamNextFixtures.get(pick.team.id)}
                activeChip={activeChip}
                onClick={onPlayerClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormationRow({
  picks,
  playerMap,
  mode,
  teamNextFixtures,
  activeChip,
  onPlayerClick,
}: {
  picks: EnrichedPick[];
  playerMap: Map<number, EnrichedPlayer>;
  mode: GwMode;
  teamNextFixtures: Map<number, EnrichedFixture[]>;
  activeChip?: string | null;
  onPlayerClick?: (elementId: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      {picks.map((pick) => (
        <PlayerCard
          key={pick.element}
          pick={pick}
          enrichedPlayer={playerMap.get(pick.element)}
          mode={mode}
          nextFixtures={teamNextFixtures.get(pick.team.id)}
          activeChip={activeChip}
          onClick={onPlayerClick}
        />
      ))}
    </div>
  );
}

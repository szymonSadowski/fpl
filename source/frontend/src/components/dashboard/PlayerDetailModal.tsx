'use client';

import { useState, useMemo } from 'react';
import { Modal } from '../ui/modal';
import { usePlayers, useElementSummary } from '../../hooks/useBootstrap';
import { formatPrice, FDR_COLORS, getPositionName } from '../../lib/utils';
import type { EnrichedPlayerHistory, EnrichedPlayerFixture, ElementSummaryResponse } from '../../types/api';

type PlayerDetailModalProps = {
  playerId: number | null;
  purchasePrice?: number;
  onClose: () => void;
};

export function PlayerDetailModal({ playerId, purchasePrice, onClose }: PlayerDetailModalProps) {
  const { data: players } = usePlayers();
  const { data: summary, isLoading } = useElementSummary(playerId);
  const [tab, setTab] = useState<'results' | 'fixtures'>('results');

  const player = useMemo(
    () => players?.find((p) => p.id === playerId) ?? null,
    [players, playerId],
  );

  if (!playerId) return null;

  const photoUrl = player
    ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`
    : '';

  return (
    <Modal open={!!playerId} onClose={onClose}>
      <div className="p-5 space-y-4">
        {/* Header */}
        {player && (
          <div className="flex items-center gap-4">
            <PlayerPhoto url={photoUrl} position={getPositionName(player.position.id)} />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-fpl-grass bg-fpl-grass/10 px-2 py-0.5 rounded">
                {player.position.name}
              </span>
              <h2 className="text-xl font-bold mt-1 tracking-wide">
                {player.firstName} {player.secondName}
              </h2>
              <p className="text-sm text-text-secondary">{player.team.name}</p>
            </div>
          </div>
        )}

        {/* Stats bar */}
        {player && (
          <div className={`grid gap-2 ${purchasePrice != null ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <Pill label="Now" value={formatPrice(player.cost)} />
            {purchasePrice != null && (
              <Pill label="Bought" value={formatPrice(purchasePrice)} />
            )}
            <Pill label="Pts/Match" value={player.pointsPerGame} />
            <Pill label="Form" value={player.form} />
            <Pill label="Selected" value={`${player.selectedByPercent}%`} />
          </div>
        )}

        {isLoading && (
          <div className="text-center text-text-muted py-6 text-sm">Loading...</div>
        )}

        {summary && (
          <>
            {/* Form - last 3 GW results */}
            {summary.history.length > 0 && (
              <div>
                <h3 className="text-xs font-display tracking-wide text-text-muted uppercase mb-2">Recent Form</h3>
                <div className="flex gap-2">
                  {summary.history.slice(-3).map((h) => (
                    <FormPill key={h.round} history={h} difficulty={findDifficulty(summary, h)} />
                  ))}
                </div>
              </div>
            )}

            {/* Next 3 fixtures — only GWs after the latest history round */}
            {(() => {
              const maxHistoryRound = summary.history.length > 0 ? Math.max(...summary.history.map((h) => h.round)) : 0;
              const upcoming = summary.fixtures.filter((f) => f.event > maxHistoryRound).slice(0, 3);
              if (upcoming.length === 0) return null;
              return (
                <div>
                  <h3 className="text-xs font-display tracking-wide text-text-muted uppercase mb-2">Upcoming</h3>
                  <div className="flex gap-2">
                    {upcoming.map((f) => (
                      <FixturePill key={f.event} fixture={f} />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Toggle tabs */}
            <div className="flex gap-1 border-b border-border">
              <TabButton active={tab === 'results'} onClick={() => setTab('results')}>
                Results
              </TabButton>
              <TabButton active={tab === 'fixtures'} onClick={() => setTab('fixtures')}>
                Fixtures
              </TabButton>
            </div>

            {/* Results table */}
            {tab === 'results' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-muted text-xs">
                      <th className="text-left py-1.5 pr-2 font-medium">GW</th>
                      <th className="text-left py-1.5 px-2 font-medium">Opp</th>
                      <th className="text-center py-1.5 px-1 font-medium">Res</th>
                      <th className="text-center py-1.5 px-1 font-medium">PTS</th>
                      <th className="text-center py-1.5 px-1 font-medium">G</th>
                      <th className="text-center py-1.5 px-1 font-medium">A</th>
                      <th className="text-center py-1.5 px-1 font-medium">CS</th>
                      <th className="text-center py-1.5 px-1 font-medium">BNS</th>
                      <th className="text-center py-1.5 px-1 font-medium">BPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...summary.history].reverse().map((h) => {
                      const unplayed = h.minutes === 0 && h.totalPoints === 0;
                      const diff = unplayed ? findDifficulty(summary, h) : null;
                      return (
                        <tr key={h.round} className={`border-b border-border/50 ${unplayed ? 'opacity-60' : ''}`}>
                          <td className="py-1 pr-2 tabular-nums">{h.round}</td>
                          <td className="py-1 px-2 text-text-secondary">
                            {h.opponentShortName} ({h.wasHome ? 'H' : 'A'})
                          </td>
                          {unplayed ? (
                            <td colSpan={7} className="text-center py-1 px-1">
                              {diff ? (
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${FDR_COLORS[diff] ?? 'bg-gray-500 text-white'}`}>
                                  {diff}
                                </span>
                              ) : (
                                <span className="text-text-muted text-xs">Not played</span>
                              )}
                            </td>
                          ) : (
                            <>
                              <td className="text-center py-1 px-1 tabular-nums text-text-secondary">
                                {h.teamHScore !== null ? `${h.teamHScore}-${h.teamAScore}` : '-'}
                              </td>
                              <td className="text-center py-1 px-1 tabular-nums font-bold">{h.totalPoints}</td>
                              <td className="text-center py-1 px-1 tabular-nums">{h.goalsScored || '-'}</td>
                              <td className="text-center py-1 px-1 tabular-nums">{h.assists || '-'}</td>
                              <td className="text-center py-1 px-1 tabular-nums">{h.cleanSheets || '-'}</td>
                              <td className="text-center py-1 px-1 tabular-nums">{h.bonus || '-'}</td>
                              <td className="text-center py-1 px-1 tabular-nums text-text-muted">{h.bps}</td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Fixtures table */}
            {tab === 'fixtures' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-muted text-xs">
                      <th className="text-left py-1.5 pr-2 font-medium">Date</th>
                      <th className="text-center py-1.5 px-2 font-medium">GW</th>
                      <th className="text-left py-1.5 px-2 font-medium">Opp</th>
                      <th className="text-center py-1.5 px-2 font-medium">FDR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.fixtures.filter((f) => f.event > (summary.history.length > 0 ? Math.max(...summary.history.map((h) => h.round)) : 0)).map((f) => (
                      <tr key={f.event} className="border-b border-border/50">
                        <td className="py-1 pr-2 text-text-secondary text-xs">
                          {new Date(f.kickoffTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="text-center py-1 px-2 tabular-nums">{f.event}</td>
                        <td className="py-1 px-2">
                          {f.opponentShortName} ({f.isHome ? 'H' : 'A'})
                        </td>
                        <td className="text-center py-1 px-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${FDR_COLORS[f.difficulty] ?? 'bg-gray-500 text-white'}`}>
                            {f.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

/** Cross-reference history entry with fixtures to get FDR for unplayed games */
function findDifficulty(summary: ElementSummaryResponse, h: EnrichedPlayerHistory): number | null {
  const fix = summary.fixtures.find(
    (f) => f.event === h.round && f.opponentShortName === h.opponentShortName,
  );
  return fix?.difficulty ?? null;
}

function PlayerPhoto({ url, position }: { url: string; position: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-20 h-24 rounded-lg bg-fpl-pitch/50 flex items-center justify-center text-sm font-bold text-fpl-grass border border-fpl-grass/30">
        {position}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="w-20 h-24 rounded-lg object-cover bg-bg-dark"
      onError={() => setFailed(true)}
    />
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-2 py-1.5 rounded-lg bg-bg-dark border border-border">
      <div className="text-[10px] text-text-muted uppercase">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

function FormPill({ history: h, difficulty }: { history: EnrichedPlayerHistory; difficulty: number | null }) {
  const unplayed = h.minutes === 0 && h.totalPoints === 0;
  return (
    <div className="flex-1 text-center px-2 py-1.5 rounded-lg bg-bg-dark border border-border">
      <div className="text-[10px] text-text-muted">GW{h.round}</div>
      <div className="text-xs text-text-secondary">
        {h.opponentShortName} ({h.wasHome ? 'H' : 'A'})
      </div>
      {unplayed && difficulty ? (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold mt-0.5 ${FDR_COLORS[difficulty] ?? 'bg-gray-500 text-white'}`}>
          {difficulty}
        </span>
      ) : (
        <div className={`text-sm font-bold mt-0.5 ${h.totalPoints >= 6 ? 'text-green-400' : h.totalPoints <= 1 ? 'text-red-400' : ''}`}>
          {h.totalPoints}
        </div>
      )}
    </div>
  );
}

function FixturePill({ fixture: f }: { fixture: EnrichedPlayerFixture }) {
  return (
    <div className="flex-1 text-center px-2 py-1.5 rounded-lg bg-bg-dark border border-border">
      <div className="text-[10px] text-text-muted">GW{f.event}</div>
      <div className="text-xs text-text-secondary">
        {f.opponentShortName} ({f.isHome ? 'H' : 'A'})
      </div>
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold mt-0.5 ${FDR_COLORS[f.difficulty] ?? 'bg-gray-500 text-white'}`}>
        {f.difficulty}
      </span>
      <div className="text-[10px] text-text-muted mt-0.5">
        {new Date(f.kickoffTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-fpl-grass text-fpl-grass'
          : 'border-transparent text-text-muted hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

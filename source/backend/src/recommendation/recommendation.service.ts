import { Injectable } from '@nestjs/common';
import { FplClientService } from '../fpl-client/fpl-client.service';
import {
  Player,
  Event as FplEvent,
} from '../common/interfaces/fpl-bootstrap.interface';
import { Fixture } from '../common/interfaces/fpl-fixture.interface';
import { Pick } from '../common/interfaces/fpl-my-team.interface';
import {
  Entry,
  EntryPicks,
  EntryHistoryResponse,
} from '../common/interfaces/fpl-entry.interface';
import { LiveResponse } from '../common/interfaces/fpl-live.interface';

type ScoredPick = Pick & { player: Player; score: number };

export type TransferSuggestion = {
  playerOut: { id: number; name: string; team: number };
  playerIn: { id: number; name: string; team: number; cost: number };
  reason: string;
  score: number;
};

export type LineupSuggestion = {
  starting: number[];
  bench: number[];
  captain: number;
  viceCaptain: number;
  reasons: Record<number, string>;
  mode: 'prediction' | 'hindsight';
  optimalPoints?: number;
  actualPoints?: number;
};

export type ChipSuggestion = {
  chip: string | null;
  reason: string;
  confidence: number;
};

@Injectable()
export class RecommendationService {
  constructor(private readonly fplClient: FplClientService) {}

  async getTransferSuggestions(teamId: number): Promise<TransferSuggestion[]> {
    const players: Player[] = await this.fplClient.getPlayersRaw();
    const events: FplEvent[] = await this.fplClient.getEvents();
    const entry: Entry = await this.fplClient.getEntry(teamId);
    const fixtures: Fixture[] = await this.fplClient.getFixturesRaw();

    const currentEvent: number =
      entry.current_event || events.find((e) => e.is_current)?.id || 1;
    const picks: EntryPicks = await this.fplClient.getEntryPicks(
      teamId,
      currentEvent,
    );
    const history: EntryHistoryResponse =
      await this.fplClient.getEntryHistory(teamId);
    const nextFixtures = fixtures.filter(
      (f) => f.event && f.event >= currentEvent && f.event <= currentEvent + 3,
    );

    const myPlayerIds = new Set(picks.picks.map((p) => p.element));
    const myPlayers = players.filter((p) => myPlayerIds.has(p.id));
    const latestHistory = history.current[history.current.length - 1];
    const bank = latestHistory?.bank || 0;

    const suggestions: TransferSuggestion[] = [];

    for (const player of myPlayers) {
      if (player.status !== 'a' || parseFloat(player.form) < 3) {
        const pick = picks.picks.find((p) => p.element === player.id);
        const sellingPrice = pick?.selling_price || player.now_cost;

        const replacements = this.findReplacements(
          player,
          players,
          myPlayerIds,
          nextFixtures,
          bank,
          sellingPrice,
        );

        for (const replacement of replacements.slice(0, 2)) {
          suggestions.push({
            playerOut: {
              id: player.id,
              name: player.web_name,
              team: player.team,
            },
            playerIn: {
              id: replacement.id,
              name: replacement.web_name,
              team: replacement.team,
              cost: replacement.now_cost,
            },
            reason: this.generateTransferReason(
              player,
              replacement,
              nextFixtures,
            ),
            score: replacement.score,
          });
        }
      }
    }

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  async getOptimalLineup(
    teamId: number,
    event?: number,
  ): Promise<LineupSuggestion> {
    const [players, events, entry, fixtures] = await Promise.all([
      this.fplClient.getPlayersRaw(),
      this.fplClient.getEvents(),
      this.fplClient.getEntry(teamId),
      this.fplClient.getFixturesRaw(),
    ]);

    const currentEvent: number =
      entry.current_event || events.find((e) => e.is_current)?.id || 1;
    const targetEvent = event ?? currentEvent;

    const eventObj = events.find((e) => e.id === targetEvent);
    const isHindsight = eventObj?.finished ?? false;

    let picks: EntryPicks;
    try {
      picks = await this.fplClient.getEntryPicks(teamId, targetEvent);
    } catch {
      picks = await this.fplClient.getEntryPicks(teamId, currentEvent);
    }

    if (isHindsight) {
      return this.buildHindsightLineup(players, picks, targetEvent);
    }

    const gw: Fixture[] = fixtures.filter(
      (f) => f.event && f.event >= targetEvent && f.event <= targetEvent + 2,
    );
    return this.buildPredictionLineup(players, picks, gw);
  }

  private async buildHindsightLineup(
    players: Player[],
    picks: EntryPicks,
    event: number,
  ): Promise<LineupSuggestion> {
    const liveData: LiveResponse = await this.fplClient.getEventLive(event);
    const pointsMap = new Map(
      liveData.elements.map((el) => [el.id, el.stats.total_points]),
    );

    const scored: ScoredPick[] = [];
    for (const pick of picks.picks) {
      const player = players.find((p) => p.id === pick.element);
      if (player) {
        scored.push({
          ...pick,
          player,
          score: pointsMap.get(pick.element) ?? 0,
        });
      }
    }

    const { starting, bench, captain, viceCaptain } =
      this.pickOptimalFormation(scored);

    const reasons: Record<number, string> = {};
    for (const s of scored) {
      const pts = pointsMap.get(s.element) ?? 0;
      reasons[s.element] = `${pts} pts`;
    }

    // Compute optimal points (captain gets 2x)
    const optimalPoints = starting.reduce((sum, id) => {
      const pts = pointsMap.get(id) ?? 0;
      return sum + (id === captain ? pts * 2 : pts);
    }, 0);

    // Compute actual points from original picks
    const actualPoints = picks.picks.reduce((sum, pick) => {
      const pts = pointsMap.get(pick.element) ?? 0;
      return sum + pts * pick.multiplier;
    }, 0);

    return {
      starting: starting.filter(Boolean),
      bench: bench.filter(Boolean),
      captain,
      viceCaptain,
      reasons,
      mode: 'hindsight',
      optimalPoints,
      actualPoints,
    };
  }

  private buildPredictionLineup(
    players: Player[],
    picks: EntryPicks,
    gwFixtures: Fixture[],
  ): LineupSuggestion {
    const scored: ScoredPick[] = [];
    for (const pick of picks.picks) {
      const player = players.find((p) => p.id === pick.element);
      if (player) {
        scored.push({
          ...pick,
          player,
          score: this.scorePlayer(player, gwFixtures),
        });
      }
    }

    let { starting, bench, captain, viceCaptain } =
      this.pickOptimalFormation(scored);

    // Force 0% COP starters to last bench slot
    for (const startingId of [...starting]) {
      const sp = scored.find((s) => s.element === startingId);
      if (!sp || sp.player.chance_of_playing_this_round !== 0) continue;
      const pos = sp.player.element_type;
      const bestBenchId = bench
        .map((id) => scored.find((s) => s.element === id))
        .filter((s): s is ScoredPick => !!s && s.player.element_type === pos)
        .sort((a, b) => b.score - a.score)[0]?.element;
      if (bestBenchId !== undefined) {
        starting = starting.map((id) => (id === startingId ? bestBenchId : id));
        bench = bench.filter((id) => id !== bestBenchId);
        bench.push(startingId);
        if (captain === startingId) captain = bestBenchId;
        if (viceCaptain === startingId) viceCaptain = bestBenchId;
      }
    }

    const reasons: Record<number, string> = {};
    for (const s of scored) {
      const cop = s.player.chance_of_playing_this_round;
      const copStr = cop != null ? `, COP: ${cop}%` : '';
      reasons[s.element] = `Form: ${s.player.form}, xG: ${s.player.expected_goals}${copStr}`;
    }

    return {
      starting: starting.filter(Boolean),
      bench: bench.filter(Boolean),
      captain,
      viceCaptain,
      reasons,
      mode: 'prediction',
    };
  }

  private pickOptimalFormation(scored: ScoredPick[]): {
    starting: number[];
    bench: number[];
    captain: number;
    viceCaptain: number;
  } {
    scored.sort((a, b) => b.score - a.score);

    const byPos: Record<number, ScoredPick[]> = { 1: [], 2: [], 3: [], 4: [] };
    for (const s of scored) {
      byPos[s.player.element_type].push(s);
    }

    const starting: number[] = [];
    const bench: number[] = [];

    starting.push(byPos[1][0].element);
    if (byPos[1][1]) bench.push(byPos[1][1].element);

    const remaining = [...byPos[2], ...byPos[3], ...byPos[4]].sort(
      (a, b) => b.score - a.score,
    );

    const counts = { 2: 0, 3: 0, 4: 0 };
    const mins = { 2: 3, 3: 2, 4: 1 };
    const maxs = { 2: 5, 3: 5, 4: 3 };

    for (const pos of [2, 3, 4] as const) {
      for (const p of byPos[pos]) {
        if (counts[pos] < mins[pos]) {
          starting.push(p.element);
          counts[pos]++;
        }
      }
    }

    for (const p of remaining) {
      if (starting.length >= 11) break;
      const pos = p.player.element_type as 2 | 3 | 4;
      if (!starting.includes(p.element) && counts[pos] < maxs[pos]) {
        starting.push(p.element);
        counts[pos]++;
      }
    }

    for (const p of remaining) {
      if (!starting.includes(p.element)) bench.push(p.element);
    }

    const startingScored = scored.filter((s) => starting.includes(s.element));
    startingScored.sort((a, b) => b.score - a.score);
    const captain = startingScored[0]?.element || starting[0];
    const viceCaptain = startingScored[1]?.element || starting[1];

    return { starting, bench, captain, viceCaptain };
  }

  async getChipSuggestion(teamId: number): Promise<ChipSuggestion> {
    const [events, entry, fixtures, history] = await Promise.all([
      this.fplClient.getEvents(),
      this.fplClient.getEntry(teamId),
      this.fplClient.getFixturesRaw(),
      this.fplClient.getEntryHistory(teamId),
    ]);

    const currentEvent =
      entry.current_event || events.find((e) => e.is_current)?.id || 1;
    const usedChips = new Set(history.chips.map((c) => c.name));
    const availableChips = ['wildcard', 'bboost', '3xc', 'freehit'].filter(
      (c) => !usedChips.has(c),
    );

    if (availableChips.length === 0) {
      return { chip: null, reason: 'No chips available', confidence: 1 };
    }

    const upcomingFixtures = fixtures.filter(
      (f) => f.event && f.event >= currentEvent && f.event <= currentEvent + 2,
    );

    const fixtureCountByTeam = new Map<number, number>();
    for (const f of upcomingFixtures.filter((f) => f.event === currentEvent)) {
      fixtureCountByTeam.set(
        f.team_h,
        (fixtureCountByTeam.get(f.team_h) || 0) + 1,
      );
      fixtureCountByTeam.set(
        f.team_a,
        (fixtureCountByTeam.get(f.team_a) || 0) + 1,
      );
    }
    const hasDoubleGW = Array.from(fixtureCountByTeam.values()).some(
      (c) => c > 1,
    );

    if (hasDoubleGW && availableChips.includes('bboost')) {
      return {
        chip: 'bboost',
        reason: 'Double gameweek - bench boost maximizes points',
        confidence: 0.8,
      };
    }

    if (hasDoubleGW && availableChips.includes('3xc')) {
      return {
        chip: '3xc',
        reason: 'Double gameweek - triple captain on premium asset',
        confidence: 0.75,
      };
    }

    return {
      chip: null,
      reason: 'No optimal chip timing detected',
      confidence: 0.5,
    };
  }

  private findReplacements(
    player: Player,
    allPlayers: Player[],
    owned: Set<number>,
    fixtures: Fixture[],
    bank: number,
    sellingPrice: number,
  ): (Player & { score: number })[] {
    const budget = bank + sellingPrice;
    const samePosition = allPlayers.filter(
      (p) =>
        p.element_type === player.element_type &&
        !owned.has(p.id) &&
        p.now_cost <= budget &&
        p.status === 'a',
    );

    return samePosition
      .map((p) => ({
        ...p,
        score: this.scorePlayer(p, fixtures),
      }))
      .sort((a, b) => b.score - a.score);
  }

  private scorePlayer(player: Player, fixtures: Fixture[]): number {
    let score = 0;
    score += parseFloat(player.form) * 2;
    score += parseFloat(player.expected_goals) * 4;
    score += parseFloat(player.expected_assists) * 3;
    score += player.total_points / 10;
    score += parseFloat(player.ict_index) * 0.05;

    const teamFixtures = fixtures.filter(
      (f) => f.team_h === player.team || f.team_a === player.team,
    );
    for (const f of teamFixtures) {
      const difficulty =
        f.team_h === player.team ? f.team_h_difficulty : f.team_a_difficulty;
      score += (5 - difficulty) * 0.5;
    }

    // Penalize part-timers; floor at 0.5 to avoid punishing new signings too hard
    const minutesWeight = Math.max(Math.min(player.minutes, 2700) / 2700, 0.5);
    score *= minutesWeight;

    // Scale by chance of playing (null = assume 100%)
    const cop = (player.chance_of_playing_this_round ?? 100) / 100;
    score *= cop;

    return score;
  }

  private generateTransferReason(
    out: Player,
    inPlayer: Player,
    fixtures: Fixture[],
  ): string {
    const reasons: string[] = [];
    if (out.status !== 'a') reasons.push(`${out.web_name} unavailable`);
    if (parseFloat(out.form) < parseFloat(inPlayer.form)) {
      reasons.push(`Better form (${inPlayer.form} vs ${out.form})`);
    }
    const inFixtures = fixtures.filter(
      (f) => f.team_h === inPlayer.team || f.team_a === inPlayer.team,
    ).length;
    if (inFixtures > 1) reasons.push(`${inFixtures} fixtures upcoming`);
    return reasons.join('; ') || 'Better underlying stats';
  }
}

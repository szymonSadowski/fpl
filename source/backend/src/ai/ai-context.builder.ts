import { Injectable } from '@nestjs/common';
import { FplClientService } from '../fpl-client/fpl-client.service';
import { RecommendationService } from '../recommendation/recommendation.service';

const POS = ['', 'GKP', 'DEF', 'MID', 'FWD'];

@Injectable()
export class AiContextBuilder {
  constructor(
    private readonly fplClient: FplClientService,
    private readonly recommendation: RecommendationService,
  ) {}

  async buildContext(teamId: number): Promise<string> {
    const [overview, players, fixtures, transfers, lineup, chip, events] =
      await Promise.all([
        this.fplClient.getTeamOverview(teamId),
        this.fplClient.getPlayersRaw(),
        this.fplClient.getFixturesRaw(),
        this.recommendation.getTransferSuggestions(teamId),
        this.recommendation.getOptimalLineup(teamId),
        this.recommendation.getChipSuggestion(teamId),
        this.fplClient.getEvents(),
      ]);

    const currentGw = overview.currentEvent;
    const playerMap = new Map(players.map((p) => [p.id, p]));

    // Detect DGWs in next 6 GWs
    const dgwEvents: number[] = [];
    for (let gw = currentGw; gw <= currentGw + 5; gw++) {
      const gwFixtures = fixtures.filter((f) => f.event === gw);
      const teamCounts = new Map<number, number>();
      for (const f of gwFixtures) {
        teamCounts.set(f.team_h, (teamCounts.get(f.team_h) || 0) + 1);
        teamCounts.set(f.team_a, (teamCounts.get(f.team_a) || 0) + 1);
      }
      if ([...teamCounts.values()].some((c) => c > 1)) dgwEvents.push(gw);
    }

    // Squad table
    const squadLines: string[] = [];
    for (const pick of overview.picks) {
      const p = playerMap.get(pick.element);
      if (!p) continue;

      // Next 5 fixtures for this player
      const nextFix = fixtures
        .filter(
          (f) =>
            f.event !== null &&
            f.event >= currentGw &&
            f.event <= currentGw + 4 &&
            (f.team_h === p.team || f.team_a === p.team),
        )
        .sort((a, b) => (a.event ?? 0) - (b.event ?? 0))
        .slice(0, 5)
        .map((f) => {
          const isHome = f.team_h === p.team;
          const diff = isHome ? f.team_h_difficulty : f.team_a_difficulty;
          return `GW${f.event}(${isHome ? 'H' : 'A'}D${diff})`;
        })
        .join(' ');

      const capFlag = pick.isCaptain ? '[C]' : pick.isViceCaptain ? '[V]' : '';
      const pos = POS[p.element_type] ?? '?';
      const cost = (pick.cost / 10).toFixed(1);
      const cop =
        p.chance_of_playing_this_round != null
          ? ` COP:${p.chance_of_playing_this_round}%`
          : '';
      squadLines.push(
        `${capFlag}${pos} ${p.web_name} £${cost} Form:${p.form} xG:${p.expected_goals} xA:${p.expected_assists} Pts:${p.total_points}${cop} | ${nextFix}`,
      );
    }

    // Transfer suggestions
    const transferLines = transfers
      .slice(0, 3)
      .map((t) => `OUT ${t.playerOut.name} → IN ${t.playerIn.name}: ${t.reason}`);

    // Lineup suggestion
    const captainPick = overview.picks.find(
      (p) => p.element === lineup.captain,
    );
    const captainName = captainPick?.webName ?? lineup.captain;

    // GW name
    const gwName = events.find((e) => e.id === currentGw)?.name ?? `GW${currentGw}`;

    const parts = [
      `=== FPL CONTEXT GW${currentGw} (${gwName}) ===`,
      `Manager: ${overview.entry.player_first_name} ${overview.entry.player_last_name}`,
      `Bank: £${(overview.bank / 10).toFixed(1)}m  Squad value: £${(overview.value / 10).toFixed(1)}m`,
      `Available chips: ${overview.availableChips.join(', ') || 'none'}`,
      `Active chip: ${overview.activeChip ?? 'none'}`,
      `Overall rank: ${overview.overallRank?.toLocaleString() ?? 'N/A'}`,
      '',
      '--- SQUAD (pos name cost form xG xA pts | next5fixtures) ---',
      ...squadLines,
      '',
      '--- RULE-BASED SUGGESTIONS ---',
      `Captain pick: ${captainName} (rule-based)`,
      `Chip: ${chip.chip ?? 'none'} — ${chip.reason} (confidence ${Math.round(chip.confidence * 100)}%)`,
      '',
      '--- TOP TRANSFER SUGGESTIONS ---',
      ...(transferLines.length ? transferLines : ['No urgent transfers']),
      '',
      `--- DOUBLE GAMEWEEKS (next 6 GWs) ---`,
      dgwEvents.length ? `DGW in: ${dgwEvents.map((g) => `GW${g}`).join(', ')}` : 'No DGWs detected',
    ];

    return parts.join('\n');
  }
}

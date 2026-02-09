import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BootstrapStatic, Team, Player, EnrichedPlayer, Event, ElementType } from '../common/interfaces/fpl-bootstrap.interface';
import { Fixture, EnrichedFixture } from '../common/interfaces/fpl-fixture.interface';
import { Entry, EntryPicks, EntryHistoryResponse } from '../common/interfaces/fpl-entry.interface';

const TTL_24H = 86400000;
const TTL_1H = 3600000;
const TTL_5MIN = 300000;

@Injectable()
export class FplClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.baseUrl =
      this.configService.get<string>('FPL_BASE_URL') ||
      'https://fantasy.premierleague.com/api';
  }

  private async getBootstrapStatic(): Promise<BootstrapStatic> {
    const cacheKey = 'bootstrap-static';
    const cached = await this.cacheManager.get<BootstrapStatic>(cacheKey);
    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.httpService.get<BootstrapStatic>(`${this.baseUrl}/bootstrap-static/`),
    );

    await this.cacheManager.set(cacheKey, data, TTL_5MIN);
    return data;
  }

  async getTeams(): Promise<Team[]> {
    const cacheKey = 'teams';
    const cached = await this.cacheManager.get<Team[]>(cacheKey);
    if (cached) return cached;

    const bootstrap = await this.getBootstrapStatic();
    await this.cacheManager.set(cacheKey, bootstrap.teams, TTL_24H);
    return bootstrap.teams;
  }

  async getPositions(): Promise<ElementType[]> {
    const cacheKey = 'positions';
    const cached = await this.cacheManager.get<ElementType[]>(cacheKey);
    if (cached) return cached;

    const bootstrap = await this.getBootstrapStatic();
    await this.cacheManager.set(cacheKey, bootstrap.element_types, TTL_24H);
    return bootstrap.element_types;
  }

  async getEvents(): Promise<Event[]> {
    const cacheKey = 'events';
    const cached = await this.cacheManager.get<Event[]>(cacheKey);
    if (cached) return cached;

    const bootstrap = await this.getBootstrapStatic();
    await this.cacheManager.set(cacheKey, bootstrap.events, TTL_1H);
    return bootstrap.events;
  }

  async getFixturesRaw(event?: number): Promise<Fixture[]> {
    const url = event
      ? `${this.baseUrl}/fixtures/?event=${event}`
      : `${this.baseUrl}/fixtures/`;
    const { data } = await firstValueFrom(
      this.httpService.get<Fixture[]>(url),
    );
    return data;
  }

  async getFixtures(event?: number): Promise<EnrichedFixture[]> {
    const [fixtures, teams] = await Promise.all([
      this.getFixturesRaw(event),
      this.getTeams(),
    ]);

    const teamMap = new Map(teams.map((t) => [t.id, t]));

    return fixtures.map((f) => {
      const home = teamMap.get(f.team_h);
      const away = teamMap.get(f.team_a);
      return {
        id: f.id,
        event: f.event,
        kickoffTime: f.kickoff_time,
        homeTeam: {
          id: f.team_h,
          name: home?.name || '',
          shortName: home?.short_name || '',
        },
        awayTeam: {
          id: f.team_a,
          name: away?.name || '',
          shortName: away?.short_name || '',
        },
        homeScore: f.team_h_score,
        awayScore: f.team_a_score,
        homeDifficulty: f.team_h_difficulty,
        awayDifficulty: f.team_a_difficulty,
        finished: f.finished,
        started: f.started,
      };
    });
  }

  async getPlayersRaw(): Promise<Player[]> {
    const cacheKey = 'players';
    const cached = await this.cacheManager.get<Player[]>(cacheKey);
    if (cached) return cached;

    const bootstrap = await this.getBootstrapStatic();
    await this.cacheManager.set(cacheKey, bootstrap.elements, TTL_5MIN);
    return bootstrap.elements;
  }

  async getPlayers(): Promise<EnrichedPlayer[]> {
    const [players, teams, positions] = await Promise.all([
      this.getPlayersRaw(),
      this.getTeams(),
      this.getPositions(),
    ]);

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const posMap = new Map(positions.map((p) => [p.id, p]));

    return players.map((p) => {
      const team = teamMap.get(p.team);
      const pos = posMap.get(p.element_type);
      return {
        id: p.id,
        webName: p.web_name,
        firstName: p.first_name,
        secondName: p.second_name,
        team: {
          id: p.team,
          name: team?.name || '',
          shortName: team?.short_name || '',
        },
        position: {
          id: p.element_type,
          name: pos?.singular_name || '',
        },
        cost: p.now_cost / 10,
        status: p.status,
        chanceOfPlaying: p.chance_of_playing_next_round,
        form: p.form,
        points: p.total_points,
        pointsPerGame: p.points_per_game,
        goals: p.goals_scored,
        assists: p.assists,
        cleanSheets: p.clean_sheets,
        xG: p.expected_goals,
        xA: p.expected_assists,
        minutes: p.minutes,
        selectedByPercent: p.selected_by_percent,
        news: p.news,
      };
    });
  }

  async getEntry(teamId: number): Promise<Entry> {
    const { data } = await firstValueFrom(
      this.httpService.get<Entry>(`${this.baseUrl}/entry/${teamId}/`),
    );
    return data;
  }

  async getEntryHistory(teamId: number): Promise<EntryHistoryResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<EntryHistoryResponse>(
        `${this.baseUrl}/entry/${teamId}/history/`,
      ),
    );
    return data;
  }

  async getEntryPicks(teamId: number, event: number): Promise<EntryPicks> {
    const { data } = await firstValueFrom(
      this.httpService.get<EntryPicks>(
        `${this.baseUrl}/entry/${teamId}/event/${event}/picks/`,
      ),
    );
    return data;
  }

  async getStandings(): Promise<{
    rank: number;
    teamId: number;
    teamName: string;
    played: number;
    win: number;
    draw: number;
    loss: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    points: number;
  }[]> {
    const [fixtures, teams] = await Promise.all([
      this.getFixturesRaw(),
      this.getTeams(),
    ]);

    const teamMap = new Map(teams.map((t) => [t.id, t.name]));
    const stats: Record<number, { w: number; d: number; l: number; gf: number; ga: number }> = {};

    teams.forEach((t) => (stats[t.id] = { w: 0, d: 0, l: 0, gf: 0, ga: 0 }));

    fixtures
      .filter((f) => f.finished && f.team_h_score !== null && f.team_a_score !== null)
      .forEach((f) => {
        const hScore = f.team_h_score!;
        const aScore = f.team_a_score!;

        stats[f.team_h].gf += hScore;
        stats[f.team_h].ga += aScore;
        stats[f.team_a].gf += aScore;
        stats[f.team_a].ga += hScore;

        if (hScore > aScore) {
          stats[f.team_h].w++;
          stats[f.team_a].l++;
        } else if (hScore < aScore) {
          stats[f.team_a].w++;
          stats[f.team_h].l++;
        } else {
          stats[f.team_h].d++;
          stats[f.team_a].d++;
        }
      });

    // Build standings array
    const standings = Object.entries(stats).map(([id, s]) => ({
      teamId: parseInt(id),
      teamName: teamMap.get(parseInt(id)) || '',
      played: s.w + s.d + s.l,
      win: s.w,
      draw: s.d,
      loss: s.l,
      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDiff: s.gf - s.ga,
      points: s.w * 3 + s.d,
    }));

    // Sort: points desc, GD desc, GF desc
    standings.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);

    // Assign rank
    return standings.map((s, i) => ({ rank: i + 1, ...s }));
  }
}

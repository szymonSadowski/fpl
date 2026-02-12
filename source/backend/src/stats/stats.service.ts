import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FplClientService } from '../fpl-client/fpl-client.service';
import { TrendsResponse, PriceChange, TransferTrend } from '../common/interfaces/fpl-bootstrap.interface';

const TTL_5MIN = 300000;
const TTL_1H = 3600000;

const POS_MAP: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' };

@Injectable()
export class StatsService {
  constructor(
    private readonly fplClient: FplClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getStandings() {
    const cacheKey = 'standings';
    const cached = await this.cacheManager.get<Awaited<ReturnType<FplClientService['getStandings']>>>(cacheKey);
    if (cached) return cached;

    const standings = await this.fplClient.getStandings();
    await this.cacheManager.set(cacheKey, standings, TTL_1H);
    return standings;
  }

  async getTrends(): Promise<TrendsResponse> {
    const cacheKey = 'trends';
    const cached = await this.cacheManager.get<TrendsResponse>(cacheKey);
    if (cached) return cached;

    const [players, teams] = await Promise.all([
      this.fplClient.getPlayersRaw(),
      this.fplClient.getTeams(),
    ]);

    const teamMap = new Map(teams.map((t) => [t.id, t.short_name]));

    const base = (p: typeof players[0]) => ({
      id: p.id,
      webName: p.web_name,
      teamShortName: teamMap.get(p.team) ?? '',
      position: POS_MAP[p.element_type] ?? '',
      cost: p.now_cost,
    });

    const priceRisers: PriceChange[] = players
      .filter((p) => p.cost_change_event > 0)
      .sort((a, b) => b.cost_change_event - a.cost_change_event)
      .map((p) => ({
        ...base(p),
        costBefore: p.now_cost - p.cost_change_event,
        costChange: p.cost_change_event,
      }));

    const priceFallers: PriceChange[] = players
      .filter((p) => p.cost_change_event < 0)
      .sort((a, b) => a.cost_change_event - b.cost_change_event)
      .map((p) => ({
        ...base(p),
        costBefore: p.now_cost - p.cost_change_event,
        costChange: p.cost_change_event,
      }));

    const topTransfersIn: TransferTrend[] = players
      .sort((a, b) => b.transfers_in_event - a.transfers_in_event)
      .slice(0, 20)
      .map((p) => ({
        ...base(p),
        transfersIn: p.transfers_in_event,
        transfersOut: p.transfers_out_event,
        selectedByPercent: p.selected_by_percent,
      }));

    const topTransfersOut: TransferTrend[] = players
      .sort((a, b) => b.transfers_out_event - a.transfers_out_event)
      .slice(0, 20)
      .map((p) => ({
        ...base(p),
        transfersIn: p.transfers_in_event,
        transfersOut: p.transfers_out_event,
        selectedByPercent: p.selected_by_percent,
      }));

    const result: TrendsResponse = { priceRisers, priceFallers, topTransfersIn, topTransfersOut };
    await this.cacheManager.set(cacheKey, result, TTL_5MIN);
    return result;
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FplClientService } from '../fpl-client/fpl-client.service';

const TTL_1H = 3600000;

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
}

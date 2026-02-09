import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('standings')
  @ApiOperation({ summary: 'Get PL standings' })
  async getStandings() {
    return this.statsService.getStandings();
  }
}

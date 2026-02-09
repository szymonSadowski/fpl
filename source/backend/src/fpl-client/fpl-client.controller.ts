import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FplClientService } from './fpl-client.service';
import { Team, EnrichedPlayer, Event, ElementType } from '../common/interfaces/fpl-bootstrap.interface';
import { EnrichedFixture } from '../common/interfaces/fpl-fixture.interface';

@ApiTags('FPL')
@Controller('fpl')
export class FplClientController {
  constructor(private readonly fplClientService: FplClientService) {}

  @Get('teams')
  @ApiOperation({ summary: 'Get PL teams (cached 24h)' })
  async getTeams(): Promise<Team[]> {
    return this.fplClientService.getTeams();
  }

  @Get('positions')
  @ApiOperation({ summary: 'Get position definitions (cached 24h)' })
  async getPositions(): Promise<ElementType[]> {
    return this.fplClientService.getPositions();
  }

  @Get('events')
  @ApiOperation({ summary: 'Get gameweeks (cached 1h)' })
  async getEvents(): Promise<Event[]> {
    return this.fplClientService.getEvents();
  }

  @Get('players')
  @ApiOperation({ summary: 'Get all players with enriched team/position data' })
  async getPlayers(): Promise<EnrichedPlayer[]> {
    return this.fplClientService.getPlayers();
  }

  @Get('fixtures')
  @ApiOperation({ summary: 'Get fixtures with enriched team data' })
  @ApiQuery({ name: 'event', required: false, description: 'Gameweek number' })
  async getFixtures(
    @Query('event', new ParseIntPipe({ optional: true })) event?: number,
  ): Promise<EnrichedFixture[]> {
    return this.fplClientService.getFixtures(event);
  }
}

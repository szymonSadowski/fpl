import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import {
  Entry,
  EntryHistoryResponse,
  EntryPicks,
  TeamOverview,
} from '../common/interfaces/fpl-entry.interface';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':teamId')
  @ApiOperation({ summary: 'Get composite team overview (squad, budget, chips)' })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  @ApiQuery({ name: 'event', required: false, description: 'Gameweek number' })
  async getTeamOverview(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('event', new ParseIntPipe({ optional: true })) event?: number,
  ): Promise<TeamOverview> {
    return this.teamsService.getTeamOverview(teamId, event);
  }

  @Get(':teamId/stats')
  @ApiOperation({ summary: 'Get team/manager info' })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  async getEntry(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<Entry> {
    return this.teamsService.getEntry(teamId);
  }

  @Get(':teamId/history')
  @ApiOperation({
    summary: 'Get team history (GW history, chips, past seasons)',
  })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  async getEntryHistory(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<EntryHistoryResponse> {
    return this.teamsService.getEntryHistory(teamId);
  }

  @Get(':teamId/picks/:event')
  @ApiOperation({ summary: 'Get team picks for a gameweek' })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  @ApiParam({ name: 'event', description: 'Gameweek number', example: 20 })
  async getEntryPicks(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('event', ParseIntPipe) event: number,
  ): Promise<EntryPicks> {
    return this.teamsService.getEntryPicks(teamId, event);
  }
}

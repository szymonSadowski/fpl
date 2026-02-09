import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('transfers/:teamId')
  @ApiOperation({
    summary: 'Get transfer suggestions based on form, fixtures, stats',
  })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  async getTransferSuggestions(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.recommendationService.getTransferSuggestions(teamId);
  }

  @Get('lineup/:teamId')
  @ApiOperation({ summary: 'Get optimal lineup (starting XI, bench, captain)' })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  @ApiQuery({ name: 'event', required: false, description: 'Gameweek number (omit for current)' })
  async getOptimalLineup(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('event') event?: string,
  ) {
    const eventNum = event ? parseInt(event, 10) : undefined;
    return this.recommendationService.getOptimalLineup(teamId, eventNum);
  }

  @Get('chip/:teamId')
  @ApiOperation({ summary: 'Get chip suggestion (DGW timing, etc.)' })
  @ApiParam({ name: 'teamId', description: 'FPL team ID', example: 2296382 })
  async getChipSuggestion(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.recommendationService.getChipSuggestion(teamId);
  }
}

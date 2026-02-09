import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { FplClientModule } from '../fpl-client/fpl-client.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [FplClientModule, StatsModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}

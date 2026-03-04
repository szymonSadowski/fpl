import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiContextBuilder } from './ai-context.builder';
import { FplClientModule } from '../fpl-client/fpl-client.module';
import { RecommendationModule } from '../recommendation/recommendation.module';

@Module({
  imports: [FplClientModule, RecommendationModule],
  controllers: [AiController],
  providers: [AiService, AiContextBuilder],
})
export class AiModule {}

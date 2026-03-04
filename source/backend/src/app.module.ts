import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FplClientModule } from './fpl-client/fpl-client.module';
import { StatsModule } from './stats/stats.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { TeamsModule } from './teams/teams.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    FplClientModule,
    StatsModule,
    RecommendationModule,
    TeamsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

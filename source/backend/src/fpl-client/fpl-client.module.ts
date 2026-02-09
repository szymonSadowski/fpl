import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FplClientService } from './fpl-client.service';
import { FplClientController } from './fpl-client.controller';

@Module({
  imports: [HttpModule],
  controllers: [FplClientController],
  providers: [FplClientService],
  exports: [FplClientService],
})
export class FplClientModule {}

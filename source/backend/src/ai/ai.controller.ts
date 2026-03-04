import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service';
import { AiContextBuilder } from './ai-context.builder';
import { ChatRequestDto } from './dto/chat-message.dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly contextBuilder: AiContextBuilder,
  ) {}

  @Post('chat/:teamId')
  async chat(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() dto: ChatRequestDto,
    @Res() res: Response,
  ) {
    const ctx = await this.contextBuilder.buildContext(teamId);
    const result = this.aiService.streamChat(ctx, dto.messages);
    result.pipeTextStreamToResponse(res);
  }

  @Post('strategy/:teamId')
  async strategy(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('gws') gws: string,
    @Res() res: Response,
  ) {
    const gwCount = parseInt(gws ?? '3', 10) || 3;
    const ctx = await this.contextBuilder.buildContext(teamId);
    const result = this.aiService.streamStrategy(ctx, gwCount);
    result.pipeTextStreamToResponse(res);
  }

  @Get('captain/:teamId')
  async captain(@Param('teamId', ParseIntPipe) teamId: number) {
    const ctx = await this.contextBuilder.buildContext(teamId);
    return this.aiService.getCaptainPick(ctx);
  }
}

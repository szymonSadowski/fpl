import { Injectable } from '@nestjs/common';
import { streamText, generateText, type StreamTextResult, type ToolSet } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ChatMessageDto } from './dto/chat-message.dto';

const FPL_SYSTEM = `You are an expert Fantasy Premier League advisor. You have deep knowledge of FPL strategy, player statistics, fixture difficulty, and team management. You will receive real-time squad context and provide concise, actionable advice. Be direct and specific. Use FPL terminology. Format responses clearly with bullet points where helpful.`;

@Injectable()
export class AiService {
  private readonly model;

  constructor() {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = anthropic('claude-haiku-4-5-20251001');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streamChat(context: string, messages: ChatMessageDto[]): StreamTextResult<ToolSet, any> {
    return streamText({
      model: this.model,
      system: `${FPL_SYSTEM}\n\n${context}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streamStrategy(context: string, gwCount: number): StreamTextResult<ToolSet, any> {
    return streamText({
      model: this.model,
      system: FPL_SYSTEM,
      prompt: `${context}\n\n---\nCreate a detailed ${gwCount}-gameweek FPL strategy plan. Include:\n1. Transfer priorities (with reasoning)\n2. Captain recommendations per GW\n3. Chip usage timing\n4. Players to target/avoid\n5. Budget management\n\nBe specific and actionable.`,
    });
  }

  async getCaptainPick(context: string): Promise<{
    captain: string;
    viceCaptain: string;
    reasoning: string;
    confidence: number;
  }> {
    const { text } = await generateText({
      model: this.model,
      system: FPL_SYSTEM,
      prompt: `${context}\n\n---\nBased on this squad context, recommend the optimal captain and vice-captain choice. Respond ONLY with valid JSON in this exact format:\n{"captain":"PlayerName","viceCaptain":"PlayerName","reasoning":"brief explanation","confidence":0.85}\n\nNo other text.`,
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}

    return {
      captain: 'Unknown',
      viceCaptain: 'Unknown',
      reasoning: text,
      confidence: 0.5,
    };
  }
}

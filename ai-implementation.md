# AI Features Implementation

## Stack
- **Vercel AI SDK** (`ai` v6) + `@ai-sdk/anthropic`
- Model: `claude-haiku-4-5-20251001` (swap 1 line to change provider)
- Frontend hooks: `@ai-sdk/react` v3

## Features
1. **Multi-GW strategy planner** — streaming, `POST /ai/strategy/:teamId?gws=N`
2. **Captain pick** — JSON, `GET /ai/captain/:teamId`
3. **Chat panel** — streaming, `POST /ai/chat/:teamId`

## Backend: `source/backend/src/ai/`

| File | Purpose |
|---|---|
| `ai-context.builder.ts` | Parallel-fetches squad/fixtures/recommendations → ~1000-token compact context string, DGW detection |
| `ai.service.ts` | `streamChat`, `streamStrategy`, `getCaptainPick` via AI SDK |
| `ai.controller.ts` | NestJS controller for 3 endpoints |
| `ai.module.ts` | Module wiring |
| `dto/chat-message.dto.ts` | Request DTOs |

### Modified
- `recommendation/recommendation.module.ts` — added `exports: [RecommendationService]`
- `app.module.ts` — added `AiModule`
- `source/backend/.env` — `ANTHROPIC_API_KEY`

### Streaming notes
- Strategy + chat use `streamText(...).pipeTextStreamToResponse(res)`
- Frontend uses `streamProtocol: 'text'` on `useCompletion` to match

## Frontend: `source/frontend/src/`

| File | Purpose |
|---|---|
| `hooks/useAiStrategy.ts` | `useCompletion` wrapper, `streamProtocol: 'text'` |
| `components/ai/AiStrategyPanel.tsx` | Glassmorphic card, GW selector (1/2/3/5), streaming plan |
| `components/ai/AiChatPanel.tsx` | Slide-in drawer, `TextStreamChatTransport`, suggested prompts |

### Modified
- `routes/team.$teamId.tsx` — `AiStrategyPanel` in right col, floating chat button, `AiChatPanel` overlay

### Markdown rendering
- Both panels use `react-markdown` + `prose prose-invert` for h1/h2/h3/ul/p

## Provider swap
```typescript
// ai.service.ts — change 2 lines:
import { openai } from '@ai-sdk/openai';
const MODEL = openai('gpt-4o');
```

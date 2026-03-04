import { useCompletion } from '@ai-sdk/react';

export function useAiStrategy(teamId: number, gwCount: number) {
  return useCompletion({
    api: `/api/ai/strategy/${teamId}?gws=${gwCount}`,
    streamProtocol: 'text',
  });
}

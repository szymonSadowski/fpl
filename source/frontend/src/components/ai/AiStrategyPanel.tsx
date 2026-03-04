import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useAiStrategy } from '../../hooks/useAiStrategy';

type Props = { teamId: number };

const GW_OPTIONS = [1, 2, 3, 5] as const;

export function AiStrategyPanel({ teamId }: Props) {
  const [gwCount, setGwCount] = useState(3);
  const { completion, complete, isLoading } = useAiStrategy(teamId, gwCount);

  const handleGenerate = () => complete('');

  return (
    <Card className="bg-bg-card/95 backdrop-blur-xl border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-text-secondary">
            <Sparkles className="w-4 h-4 text-fpl-gold" />
            AI Strategy
          </CardTitle>
          {completion && (
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">GWs ahead:</span>
          <div className="flex gap-1">
            {GW_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setGwCount(n)}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  gwCount === n
                    ? 'bg-fpl-gold/20 border-fpl-gold/50 text-fpl-gold'
                    : 'border-border/50 text-text-secondary hover:border-border hover:text-text-primary'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {!completion && !isLoading && (
          <Button
            onClick={handleGenerate}
            className="w-full bg-fpl-gold/10 hover:bg-fpl-gold/20 border border-fpl-gold/30 text-fpl-gold text-sm"
            variant="ghost"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {gwCount}-GW Plan
          </Button>
        )}

        {(completion || isLoading) && (
          <div className="prose prose-invert max-h-96 overflow-y-auto rounded bg-bg-dark/50 p-3 border border-border/30 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:text-sm [&_p]:my-1 [&_li]:text-sm [&_li]:my-0.5 [&_ul]:pl-4 [&_ol]:pl-4 [&_strong]:text-white [&_*]:text-text-primary">
            <ReactMarkdown>{completion}</ReactMarkdown>
            {isLoading && <span className="animate-pulse text-fpl-gold">▋</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

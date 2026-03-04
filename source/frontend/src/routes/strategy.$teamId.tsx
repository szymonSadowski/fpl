import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { LogOut, RefreshCw, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SquadDisplay } from '../components/dashboard/SquadDisplay';
import { ChipsCard } from '../components/dashboard/ChipsCard';
import { useQueryClient } from '@tanstack/react-query';
import { useEvents } from '../hooks/useBootstrap';
import { useEntry } from '../hooks/useEntry';
import { AiStrategyPanel } from '../components/ai/AiStrategyPanel';
import { AiChatPanel } from '../components/ai/AiChatPanel';

export const Route = createFileRoute('/strategy/$teamId')({
  component: StrategyPage,
});

function StrategyPage() {
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const { teamId } = Route.useParams();
  const teamIdNum = parseInt(teamId, 10);
  const queryClient = useQueryClient();
  const { data: events } = useEvents();
  const { data: entry } = useEntry(teamIdNum);

  const currentEvent = events?.find((e) => e.is_current);
  const currentGw = currentEvent?.id ?? entry?.current_event ?? 1;
  const lastEvent = events ? Math.max(...events.map((e) => e.id)) : currentGw;
  const nextGw = currentGw < lastEvent ? currentGw + 1 : currentGw;

  const managerName = entry
    ? `${entry.player_first_name} ${entry.player_last_name}`
    : `Team #${teamId}`;

  return (
    <div className="min-h-screen">
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-fpl-grass/5 blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-fpl-pitch/20 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display tracking-wider">
              FPL <span className="text-gradient">STRATEGY</span>
            </h1>
            {currentEvent && (
              <p className="text-sm text-text-secondary">
                Planning GW{nextGw} &bull; {managerName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/team/$teamId" params={{ teamId: String(teamId) }}>
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/stats">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
                Stats
              </Button>
            </Link>
            <Link to="/trends">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4" />
                Trends
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => queryClient.invalidateQueries()}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate({ to: '/' })}>
              <LogOut className="w-4 h-4" />
              Change Team
            </Button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: squad + chips */}
          <div className="space-y-6">
            <SquadDisplay
              teamId={teamIdNum}
              gw={nextGw}
              currentGw={currentGw}
              onGwChange={() => {}}
            />
            <ChipsCard teamId={teamIdNum} gw={nextGw} />
          </div>

          {/* Right: AI strategy panel */}
          <div>
            <AiStrategyPanel teamId={teamIdNum} />
          </div>
        </div>
      </main>

      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-fpl-gold/90 hover:bg-fpl-gold text-bg-dark text-sm font-semibold shadow-lg shadow-fpl-gold/30 transition-all hover:scale-105"
      >
        <Sparkles className="w-4 h-4" />
        AI Chat
      </button>

      {aiOpen && <AiChatPanel teamId={teamIdNum} onClose={() => setAiOpen(false)} />}
    </div>
  );
}

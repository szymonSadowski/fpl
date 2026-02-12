import { createFileRoute, Link } from '@tanstack/react-router';
import { Home, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { StandingsTable } from '../components/stats/StandingsTable';
import { BestPlayers } from '../components/stats/BestPlayers';

export const Route = createFileRoute('/stats')({
  component: StatsPage,
});

function StatsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display tracking-wider">
            FPL <span className="text-fpl-grass">STATS</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/trends">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4" />
                Trends
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <StandingsTable />
        <BestPlayers />
      </main>
    </div>
  );
}

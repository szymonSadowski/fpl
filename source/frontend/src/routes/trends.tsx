import { createFileRoute, Link } from '@tanstack/react-router';
import { Home, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TrendsPanel } from '../components/stats/TrendsPanel';

export const Route = createFileRoute('/trends')({
  component: TrendsPage,
});

function TrendsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display tracking-wider">
            FPL <span className="text-gradient">TRENDS</span>
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/stats">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
                Stats
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
        <TrendsPanel />
      </main>
    </div>
  );
}

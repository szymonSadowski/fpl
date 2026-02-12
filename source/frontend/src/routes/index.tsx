import { createFileRoute, Link } from '@tanstack/react-router';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { TeamIdForm } from '../components/landing/TeamIdForm';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <TeamIdForm />
      <Features />

      {/* CTA strip */}
      <section className="relative py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fpl-pitch/10 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-center gap-4">
          <Link to="/stats">
            <Button variant="secondary" size="md">
              <BarChart3 className="w-4 h-4" />
              League Stats
            </Button>
          </Link>
          <Link to="/trends">
            <Button variant="ghost" size="md">
              <TrendingUp className="w-4 h-4" />
              Trends
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p className="font-display tracking-wider text-text-secondary">FPL STRATEGY SUITE</p>
          <p>&copy; {new Date().getFullYear()} &middot; Not affiliated with the Premier League</p>
        </div>
      </footer>
    </main>
  );
}

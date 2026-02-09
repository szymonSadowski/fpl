import { createFileRoute, Link } from '@tanstack/react-router';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { TeamIdForm } from '../components/landing/TeamIdForm';
import { BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <TeamIdForm />

      <div className="flex justify-center py-6">
        <Link to="/stats">
          <Button variant="secondary" size="sm">
            <BarChart3 className="w-4 h-4" />
            View Stats
          </Button>
        </Link>
      </div>

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
          <p>FPL Strategy Suite &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Not affiliated with the Premier League or Fantasy Premier League.</p>
        </div>
      </footer>
    </main>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { TeamIdForm } from '../components/landing/TeamIdForm';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <TeamIdForm />

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
          <p>FPL Strategy Suite &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Not affiliated with the Premier League or Fantasy Premier League.</p>
        </div>
      </footer>
    </main>
  );
}

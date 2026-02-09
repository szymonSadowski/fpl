import { TrendingUp, Target, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-fpl-pitch/30 via-bg-dark to-bg-dark" />

      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-fpl-grass/5 to-transparent transform skew-x-12 origin-top-right" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fpl-grass/10 border border-fpl-grass/30 text-fpl-grass text-sm mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            AI-Powered FPL Insights
          </div>

          <h1 className="text-5xl md:text-7xl font-display tracking-wider mb-6 animate-slide-up">
            DOMINATE YOUR
            <span className="block text-fpl-grass">FPL LEAGUE</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-xl mb-8 animate-slide-up stagger-1">
            Data-driven transfer recommendations, optimal lineups, and chip timing
            powered by betting odds and statistical models.
          </p>

          <div className="flex flex-wrap gap-8 animate-slide-up stagger-2">
            <Stat icon={<TrendingUp className="w-5 h-5" />} value="15%" label="Avg rank improvement" />
            <Stat icon={<Target className="w-5 h-5" />} value="87%" label="Prediction accuracy" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-fpl-gold/10 text-fpl-gold">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-display text-text-primary">{value}</div>
        <div className="text-sm text-text-secondary">{label}</div>
      </div>
    </div>
  );
}

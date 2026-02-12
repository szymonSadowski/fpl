import { Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Dot grid texture */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orb — top right */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-fpl-grass/8 blur-[120px] animate-orb-drift" />

      {/* Pitch purple orb — bottom left */}
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-fpl-pitch/30 blur-[100px] animate-orb-drift" style={{ animationDelay: '3s' }} />

      {/* Scan line accent */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-fpl-grass/20 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fpl-grass/10 border border-fpl-grass/20 text-fpl-grass text-sm mb-8 animate-fade-in glow-grass">
          <Zap className="w-4 h-4" />
          <span className="tracking-wide">AI-POWERED FPL INSIGHTS</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display tracking-wider leading-none mb-6 animate-slide-up">
          DOMINATE YOUR
          <span className="block text-gradient">FPL LEAGUE</span>
        </h1>

        {/* Sub */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto animate-slide-up stagger-1">
          Data-driven transfer recommendations, optimal lineups, and chip timing
          powered by betting odds and statistical models.
        </p>

        {/* Decorative line */}
        <div className="mt-10 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-fpl-grass/40 to-transparent animate-slide-up stagger-2" />
      </div>
    </section>
  );
}

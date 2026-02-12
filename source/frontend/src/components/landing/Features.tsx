import { ArrowRightLeft, Users, Sparkles, Calendar } from 'lucide-react';

const features = [
  {
    icon: <ArrowRightLeft className="w-5 h-5" />,
    title: 'SMART TRANSFERS',
    description: 'AI analyzes fixtures, form, and betting odds to recommend optimal transfers each gameweek.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'LINEUP OPTIMIZER',
    description: 'Automatic captain picks and bench order based on expected points and fixture difficulty.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'CHIP TIMING',
    description: 'Know exactly when to play your Wildcard, Bench Boost, Triple Captain, or Free Hit.',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'FIXTURE ANALYSIS',
    description: 'Deep dive into upcoming fixtures with difficulty ratings and rotation risk alerts.',
  },
];

export function Features() {
  return (
    <section className="relative py-20 px-6">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-fpl-grass/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-4 animate-slide-up">
            YOUR <span className="text-gradient">UNFAIR ADVANTAGE</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto animate-slide-up stagger-1">
            Stop guessing. Start winning. Thousands of data points distilled into actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="
                group relative rounded-xl border border-border bg-bg-card/60 backdrop-blur-sm p-6
                hover:border-fpl-grass/30 hover:bg-bg-card-hover
                transition-all duration-300
                animate-slide-up
              "
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              {/* Index number */}
              <span className="absolute top-4 right-4 text-xs font-display text-text-muted/40 tracking-wider">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="
                w-10 h-10 rounded-lg flex items-center justify-center mb-4
                bg-fpl-pitch/40 text-fpl-grass
                group-hover:bg-fpl-grass group-hover:text-bg-dark
                transition-all duration-300
              ">
                {feature.icon}
              </div>

              <h3 className="text-base font-display tracking-wide mb-2 text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-fpl-grass/0 group-hover:bg-fpl-grass/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

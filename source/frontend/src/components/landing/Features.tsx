import { ArrowRightLeft, Users, Sparkles, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const features = [
  {
    icon: <ArrowRightLeft className="w-6 h-6" />,
    title: 'SMART TRANSFERS',
    description: 'AI analyzes fixtures, form, and betting odds to recommend optimal transfers each gameweek.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'LINEUP OPTIMIZER',
    description: 'Automatic captain picks and bench order based on expected points and fixture difficulty.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'CHIP TIMING',
    description: 'Know exactly when to play your Wildcard, Bench Boost, Triple Captain, or Free Hit.',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'FIXTURE ANALYSIS',
    description: 'Deep dive into upcoming fixtures with difficulty ratings and rotation risk alerts.',
  },
];

export function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display tracking-wide mb-4">
            YOUR <span className="text-fpl-grass">UNFAIR ADVANTAGE</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Stop guessing. Start winning. Our algorithms process thousands of data points
            to give you actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="group hover:bg-bg-card-hover hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent>
                <div className="p-3 rounded-lg bg-fpl-pitch/50 text-fpl-grass w-fit mb-4 group-hover:bg-fpl-grass group-hover:text-bg-dark transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-display tracking-wide mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

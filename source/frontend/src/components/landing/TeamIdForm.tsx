import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, AlertCircle } from 'lucide-react';

export function TeamIdForm() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const id = parseInt(inputValue, 10);
    if (isNaN(id) || id <= 0) {
      setError('Enter a valid team ID (positive number)');
      return;
    }

    navigate({ to: '/team/$teamId', params: { teamId: id.toString() } });
  };

  return (
    <section className="relative py-8 px-6" id="connect">
      <div className="max-w-xl mx-auto animate-slide-up stagger-3">
        {/* Inline form — no heavy card wrapper */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-center text-sm font-medium text-text-secondary tracking-wide uppercase mb-4">
            Enter your Team ID to get started
          </label>

          <div
            className={`
              flex items-center gap-2 rounded-xl border bg-bg-card/80 backdrop-blur-sm
              transition-colors duration-300
              ${focused ? 'border-fpl-grass/60 glow-grass-strong' : 'border-border hover:border-fpl-grass/30'}
            `}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 123456"
              name="team-id"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="flex-1 bg-transparent px-5 py-4 text-lg text-text-primary placeholder:text-text-muted focus-visible:outline-none"
            />
            <button
              type="submit"
              className="
                m-1.5 px-6 py-3 rounded-lg
                bg-fpl-grass text-bg-dark font-semibold
                hover:bg-fpl-grass/90 hover:shadow-lg hover:shadow-fpl-grass/25
                active:scale-95
                transition-all duration-200
                flex items-center gap-2
                animate-pulse-glow
              "
            >
              GO
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-danger text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-text-muted text-center pt-1">
            Find your ID in the URL: fantasy.premierleague.com/entry/<strong className="text-text-secondary">ID</strong>/event/...
          </p>
        </form>
      </div>
    </section>
  );
}

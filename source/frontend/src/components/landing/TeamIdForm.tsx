import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Users, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function TeamIdForm() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    <section className="py-20 px-6" id="connect">
      <div className="max-w-md mx-auto">
        <Card gradient className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              ENTER YOUR <span className="text-fpl-grass">TEAM ID</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Team ID"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 123456"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                required
              />

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                <Users className="w-4 h-4" />
                View My Team
              </Button>

              <p className="text-xs text-text-muted text-center">
                Find your team ID in the FPL website URL: fantasy.premierleague.com/entry/<strong>ID</strong>/event/...
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

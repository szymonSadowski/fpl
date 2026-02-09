import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { LogOut, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SquadDisplay } from '../components/dashboard/SquadDisplay';
import { LineupRecPanel } from '../components/dashboard/LineupRecPanel';
import { useQueryClient } from '@tanstack/react-query';
import { useEvents } from '../hooks/useBootstrap';
import { useEntry } from '../hooks/useEntry';

type TeamSearch = { gw?: number };

export const Route = createFileRoute('/team/$teamId')({
  component: TeamPage,
  validateSearch: (search: Record<string, unknown>): TeamSearch => ({
    gw: search.gw ? Number(search.gw) : undefined,
  }),
});

function TeamPage() {
  const navigate = useNavigate();
  const { teamId } = Route.useParams();
  const { gw } = Route.useSearch();
  const teamIdNum = parseInt(teamId, 10);
  const queryClient = useQueryClient();
  const { data: events } = useEvents();
  const { data: entry } = useEntry(teamIdNum);

  const currentEvent = events?.find((e) => e.is_current);
  const currentGw = currentEvent?.id ?? entry?.current_event ?? 1;
  const selectedGw = gw ?? currentGw;

  const handleGwChange = (newGw: number) => {
    navigate({
      to: '/team/$teamId',
      params: { teamId },
      search: newGw === currentGw ? {} : { gw: newGw },
      replace: true,
    });
  };

  const handleChangeTeam = () => {
    navigate({ to: '/' });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  const managerName = entry
    ? `${entry.player_first_name} ${entry.player_last_name}`
    : `Team #${teamId}`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display tracking-wider">
              FPL <span className="text-fpl-grass">STRATEGY</span>
            </h1>
            {currentEvent && (
              <p className="text-sm text-text-secondary">
                {currentEvent.name} &bull; {managerName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/stats">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
                Stats
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={handleChangeTeam}>
              <LogOut className="w-4 h-4" />
              Change Team
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <SquadDisplay
            teamId={teamIdNum}
            gw={selectedGw}
            currentGw={currentGw}
            onGwChange={handleGwChange}
          />

          <div className="space-y-6">
            <LineupRecPanel teamId={teamIdNum} gw={selectedGw} currentGw={currentGw} />
          </div>
        </div>
      </main>
    </div>
  );
}

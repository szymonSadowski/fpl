import { useStandings } from '../../hooks/useStats';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Loader } from '../ui/loader';

export function StandingsTable() {
  const { data: standings, isLoading, isError } = useStandings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20">
          <Loader className="mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !standings) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-text-secondary">
          Failed to load standings
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PREMIER LEAGUE <span className="text-gradient">STANDINGS</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-text-muted">
                <th className="text-left py-2 px-2 w-8">#</th>
                <th className="text-left py-2 px-2">Team</th>
                <th className="text-center py-2 px-2">P</th>
                <th className="text-center py-2 px-2">W</th>
                <th className="text-center py-2 px-2">D</th>
                <th className="text-center py-2 px-2">L</th>
                <th className="text-center py-2 px-2">GF</th>
                <th className="text-center py-2 px-2">GA</th>
                <th className="text-center py-2 px-2">GD</th>
                <th className="text-center py-2 px-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.teamId} className="border-b border-border/30 hover:bg-bg-card-hover/50 transition-colors">
                  <td className="py-2 px-2 text-text-muted tabular-nums">{s.rank}</td>
                  <td className="py-2 px-2 font-medium">{s.teamName}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.played}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.win}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.draw}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.loss}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.goalsFor}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.goalsAgainst}</td>
                  <td className="py-2 px-2 text-center tabular-nums">{s.goalDiff}</td>
                  <td className="py-2 px-2 text-center font-bold text-fpl-grass tabular-nums">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

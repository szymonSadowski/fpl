import { cn, formatPrice, getPositionName } from '../../lib/utils';
import type { EnrichedPick, EnrichedPlayer } from '../../types/api';

type PlayerCardProps = {
  pick: EnrichedPick;
  enrichedPlayer?: EnrichedPlayer;
  compact?: boolean;
};

export function PlayerCard({ pick, enrichedPlayer, compact }: PlayerCardProps) {
  const position = getPositionName(pick.playerPosition.id);
  const eventPoints = enrichedPlayer?.eventPoints ?? 0;
  const status = enrichedPlayer?.status ?? 'a';

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-card hover:bg-bg-card-hover transition-colors">
        <div className="w-8 h-8 rounded-full bg-fpl-pitch/50 flex items-center justify-center text-xs font-medium text-fpl-grass">
          {position}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium truncate">{pick.webName}</span>
            {pick.isCaptain && <Badge>C</Badge>}
            {pick.isViceCaptain && <Badge variant="secondary">V</Badge>}
          </div>
          <div className="text-xs text-text-secondary">{pick.team.shortName}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{eventPoints * (pick.multiplier || 1)}</div>
          <div className="text-xs text-text-muted">{formatPrice(pick.cost)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="w-16 flex flex-col items-center">
        {/* Jersey */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-fpl-pitch to-fpl-pitch/70 flex items-center justify-center mb-1 border-2 border-fpl-grass/30 group-hover:border-fpl-grass transition-colors">
          <span className="text-xs font-bold text-fpl-grass">{position}</span>
          {/* Status indicator */}
          <div className={cn('absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-dark', {
            'bg-success': status === 'a',
            'bg-warning': status === 'd',
            'bg-danger': status === 'i' || status === 's',
            'bg-text-muted': status === 'u',
          })} />
        </div>

        {/* Name plate */}
        <div className="w-full bg-bg-card rounded px-1 py-0.5 text-center">
          <div className="text-[10px] font-medium truncate">{pick.webName}</div>
          <div className="text-[9px] text-text-muted">{eventPoints * (pick.multiplier || 1)} pts</div>
        </div>

        {/* Captain badge */}
        {pick.isCaptain && (
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-fpl-gold text-bg-dark flex items-center justify-center text-[10px] font-bold">
            C
          </div>
        )}
        {pick.isViceCaptain && (
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-fpl-grass text-bg-dark flex items-center justify-center text-[10px] font-bold">
            V
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold',
      variant === 'primary' ? 'bg-fpl-gold text-bg-dark' : 'bg-fpl-grass text-bg-dark'
    )}>
      {children}
    </span>
  );
}

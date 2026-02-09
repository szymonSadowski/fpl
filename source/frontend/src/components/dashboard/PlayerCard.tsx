import { cn, formatPrice, getPositionName } from '../../lib/utils';
import type { Player } from '../../types/api';

type PlayerCardProps = {
  player: Player;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  multiplier?: number;
  sellingPrice?: number;
  compact?: boolean;
  teamName?: string;
};

export function PlayerCard({
  player,
  isCaptain,
  isViceCaptain,
  multiplier = 1,
  sellingPrice,
  compact,
  teamName,
}: PlayerCardProps) {
  const position = getPositionName(player.element_type);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-card hover:bg-bg-card-hover transition-colors">
        <div className="w-8 h-8 rounded-full bg-fpl-pitch/50 flex items-center justify-center text-xs font-medium text-fpl-grass">
          {position}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium truncate">{player.web_name}</span>
            {isCaptain && <Badge>C</Badge>}
            {isViceCaptain && <Badge variant="secondary">V</Badge>}
          </div>
          <div className="text-xs text-text-secondary">{teamName}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{player.event_points * multiplier}</div>
          <div className="text-xs text-text-muted">{formatPrice(sellingPrice || player.now_cost)}</div>
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
            'bg-success': player.status === 'a',
            'bg-warning': player.status === 'd',
            'bg-danger': player.status === 'i' || player.status === 's',
            'bg-text-muted': player.status === 'u',
          })} />
        </div>

        {/* Name plate */}
        <div className="w-full bg-bg-card rounded px-1 py-0.5 text-center">
          <div className="text-[10px] font-medium truncate">{player.web_name}</div>
          <div className="text-[9px] text-text-muted">{player.event_points * multiplier} pts</div>
        </div>

        {/* Captain badge */}
        {isCaptain && (
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-fpl-gold text-bg-dark flex items-center justify-center text-[10px] font-bold">
            C
          </div>
        )}
        {isViceCaptain && (
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

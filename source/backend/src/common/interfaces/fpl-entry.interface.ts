import { Pick } from './fpl-my-team.interface';
import { TeamInfo } from './fpl-fixture.interface';
import { PositionInfo } from './fpl-bootstrap.interface';

export type Entry = {
  id: number;
  player_first_name: string;
  player_last_name: string;
  name: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  current_event: number;
};

export type EntryHistory = {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  bank: number;
  value: number;
};

export type EntryHistoryResponse = {
  current: EntryHistory[];
  past: { season_name: string; total_points: number; rank: number }[];
  chips: { name: string; event: number }[];
};

export type AutomaticSub = {
  element_in: number;
  element_out: number;
};

export type EntryPicks = {
  entry_history: EntryHistory;
  picks: Pick[];
  automatic_subs: AutomaticSub[];
};

export type EnrichedPick = {
  element: number;
  position: number;
  multiplier: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  webName: string;
  team: TeamInfo;
  playerPosition: PositionInfo;
  cost: number;
  gwPoints?: number;
  opponent?: { shortName: string; isHome: boolean };
};

export type TeamOverview = {
  entry: Entry;
  currentEvent: number;
  selectedEvent: number;
  picks: EnrichedPick[];
  bank: number;
  value: number;
  availableChips: string[];
  activeChip: string | null;
  chipUsage: { name: string; event: number }[];
  firstHalfEnd: number;
};

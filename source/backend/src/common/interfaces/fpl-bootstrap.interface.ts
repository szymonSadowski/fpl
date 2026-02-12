import { TeamInfo } from './fpl-fixture.interface';

export type ElementType = {
  id: number;
  plural_name: string;
  plural_name_short: string;
  singular_name: string;
  singular_name_short: string;
  squad_select: number;
  squad_min_play: number;
  squad_max_play: number;
};

export type Team = {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
};

export type Player = {
  id: number;
  code: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  team_code: number;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  now_cost: number;
  cost_change_start: number;
  cost_change_event: number;
  status: 'a' | 'd' | 'i' | 's' | 'u'; // available, doubtful, injured, suspended, unavailable
  chance_of_playing_this_round: number | null;
  chance_of_playing_next_round: number | null;
  total_points: number;
  event_points: number;
  points_per_game: string;
  form: string;
  value_form: string;
  value_season: string;
  selected_by_percent: string;
  transfers_in: number;
  transfers_out: number;
  transfers_in_event: number;
  transfers_out_event: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  news: string;
  news_added: string | null;
};

export type Event = {
  id: number;
  name: string;
  deadline_time: string;
  average_entry_score: number;
  finished: boolean;
  data_checked: boolean;
  highest_scoring_entry: number | null;
  highest_score: number | null;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  chip_plays: { chip_name: string; num_played: number }[];
  most_selected: number | null;
  most_transferred_in: number | null;
  top_element: number | null;
  transfers_made: number;
  most_captained: number | null;
  most_vice_captained: number | null;
};

export type BootstrapStatic = {
  events: Event[];
  game_settings: Record<string, unknown>;
  phases: {
    id: number;
    name: string;
    start_event: number;
    stop_event: number;
  }[];
  teams: Team[];
  total_players: number;
  elements: Player[];
  element_stats: { label: string; name: string }[];
  element_types: ElementType[];
};

export type PositionInfo = {
  id: number;
  name: string;
};

export type TrendPlayer = {
  id: number;
  webName: string;
  teamShortName: string;
  position: string;
  cost: number;
};

export type PriceChange = TrendPlayer & {
  costBefore: number;
  costChange: number;
};

export type TransferTrend = TrendPlayer & {
  transfersIn: number;
  transfersOut: number;
  selectedByPercent: string;
};

export type TrendsResponse = {
  priceRisers: PriceChange[];
  priceFallers: PriceChange[];
  topTransfersIn: TransferTrend[];
  topTransfersOut: TransferTrend[];
};

export type EnrichedPlayer = {
  id: number;
  code: number;
  webName: string;
  firstName: string;
  secondName: string;
  team: TeamInfo;
  position: PositionInfo;
  cost: number;
  status: string;
  chanceOfPlaying: number | null;
  form: string;
  points: number;
  pointsPerGame: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  xG: string;
  xA: string;
  minutes: number;
  selectedByPercent: string;
  news: string;
  eventPoints: number;
  bonus: number;
  bps: number;
  ictIndex: string;
};

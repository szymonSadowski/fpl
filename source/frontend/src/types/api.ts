// FPL Bootstrap types
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
  element_type: number;
  now_cost: number;
  cost_change_start: number;
  cost_change_event: number;
  status: 'a' | 'd' | 'i' | 's' | 'u';
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
  chip_plays: Array<{ chip_name: string; num_played: number }>;
  most_selected: number | null;
  most_transferred_in: number | null;
  top_element: number | null;
  transfers_made: number;
  most_captained: number | null;
  most_vice_captained: number | null;
};

export type BootstrapStatic = {
  events: Array<Event>;
  game_settings: Record<string, unknown>;
  phases: Array<{ id: number; name: string; start_event: number; stop_event: number }>;
  teams: Array<Team>;
  total_players: number;
  elements: Array<Player>;
  element_stats: Array<{ label: string; name: string }>;
  element_types: Array<ElementType>;
};

// Pick types (used in entry picks)
export type Pick = {
  element: number;
  position: number;
  selling_price: number;
  multiplier: number;
  purchase_price: number;
  is_captain: boolean;
  is_vice_captain: boolean;
};

// Entry History types
export type EntryHistoryGW = {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  bank: number;
  value: number;
};

export type EntryHistoryResponse = {
  current: Array<EntryHistoryGW>;
  past: Array<{ season_name: string; total_points: number; rank: number }>;
  chips: Array<{ name: string; event: number }>;
};

// Recommendations types
export type TransferRecommendation = {
  playerOut: { id: number; name: string; team: number };
  playerIn: { id: number; name: string; team: number; cost: number };
  reason: string;
  score: number;
};

export type LineupRecommendation = {
  starting: Array<number>;
  bench: Array<number>;
  captain: number;
  viceCaptain: number;
  reasons: Record<number, string>;
};

export type ChipRecommendation = {
  chip: 'wildcard' | '3xc' | 'bboost' | 'freehit' | null;
  reason: string;
  confidence: number;
};

// Fixture types
export type Fixture = {
  id: number;
  event: number;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  kickoff_time: string;
  finished: boolean;
  team_h_difficulty: number;
  team_a_difficulty: number;
};

export type EnrichedFixture = {
  id: number;
  event: number | null;
  kickoffTime: string | null;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore: number | null;
  awayScore: number | null;
  homeDifficulty: number;
  awayDifficulty: number;
  finished: boolean;
  started: boolean;
};

// Standings types (from API-Football)
export type Standing = {
  rank: number;
  teamId: number;
  teamName: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

// Enriched types (camelCase from backend)
export type TeamInfo = {
  id: number;
  name: string;
  shortName: string;
};

export type PositionInfo = {
  id: number;
  name: string;
};

export type EnrichedPlayer = {
  id: number;
  webName: string;
  firstName: string;
  secondName: string;
  team: TeamInfo;
  position: PositionInfo;
  cost: number;
  points: number;
  eventPoints: number;
  form: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  xG: string;
  xA: string;
  selectedByPercent: string;
  minutes: number;
  status: 'a' | 'd' | 'i' | 's' | 'u';
  news: string;
  bonus: number;
  bps: number;
  ictIndex: string;
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
  entry: {
    id: number;
    playerFirstName: string;
    playerLastName: string;
    name: string;
    summaryOverallPoints: number;
    summaryOverallRank: number;
    summaryEventPoints: number;
    currentEvent: number;
  };
  currentEvent: number;
  selectedEvent: number;
  picks: EnrichedPick[];
  bank: number;
  value: number;
  availableChips: string[];
};

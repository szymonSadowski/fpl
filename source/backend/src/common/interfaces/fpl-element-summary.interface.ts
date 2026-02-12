// Raw types from FPL /element-summary/{id}/ endpoint

export type ElementSummaryHistoryRaw = {
  element: number;
  fixture: number;
  opponent_team: number;
  total_points: number;
  was_home: boolean;
  kickoff_time: string;
  team_h_score: number | null;
  team_a_score: number | null;
  round: number;
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
  starts: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  value: number;
  transfers_balance: number;
  selected: number;
  transfers_in: number;
  transfers_out: number;
};

export type ElementSummaryFixtureRaw = {
  id: number;
  code: number;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  event: number;
  finished: boolean;
  is_home: boolean;
  kickoff_time: string;
  difficulty: number;
};

export type ElementSummaryRaw = {
  fixtures: ElementSummaryFixtureRaw[];
  history: ElementSummaryHistoryRaw[];
  history_past: { season_name: string; total_points: number }[];
};

// Enriched camelCase output types

export type EnrichedPlayerHistory = {
  round: number;
  opponentShortName: string;
  totalPoints: number;
  wasHome: boolean;
  teamHScore: number | null;
  teamAScore: number | null;
  minutes: number;
  goalsScored: number;
  assists: number;
  cleanSheets: number;
  bonus: number;
  bps: number;
};

export type EnrichedPlayerFixture = {
  event: number;
  opponentShortName: string;
  isHome: boolean;
  difficulty: number;
  kickoffTime: string;
};

export type ElementSummaryResponse = {
  history: EnrichedPlayerHistory[];
  fixtures: EnrichedPlayerFixture[];
};

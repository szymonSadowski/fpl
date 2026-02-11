export type FixtureStat = {
  identifier: string;
  a: { value: number; element: number }[];
  h: { value: number; element: number }[];
};

export type Fixture = {
  id: number;
  code: number;
  event: number | null;
  finished: boolean;
  finished_provisional: boolean;
  kickoff_time: string | null;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  team_a_difficulty: number;
  team_h_difficulty: number;
  stats: FixtureStat[];
  pulse_id: number;
};

export type TeamInfo = {
  id: number;
  name: string;
  shortName: string;
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
  stats: FixtureStat[];
};

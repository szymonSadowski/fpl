import { useGet } from './useFetch';
import type { EntryHistoryResponse, Pick, TeamOverview } from '../types/api';

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
  overall_rank: number;
  bank: number;
  value: number;
};

export type EntryPicks = {
  entry_history: EntryHistory;
  picks: Array<Pick>;
  automatic_subs: Array<{ element_in: number; element_out: number }>;
};

export const useEntry = (teamId: number) =>
  useGet<Entry>({
    endpoint: '/teams/{teamId}/stats',
    pathParams: { teamId },
    queryKey: ['entry', teamId],
    staleTime: 60 * 1000,
  });

export const useEntryHistory = (teamId: number) =>
  useGet<EntryHistoryResponse>({
    endpoint: '/teams/{teamId}/history',
    pathParams: { teamId },
    queryKey: ['entryHistory', teamId],
    staleTime: 60 * 1000,
  });

export const useEntryPicks = (teamId: number, event?: number) =>
  useGet<EntryPicks>({
    endpoint: '/teams/{teamId}/picks/{event}',
    pathParams: { teamId, event },
    queryKey: ['entryPicks', teamId, event],
    staleTime: 60 * 1000,
  });

export const useTeamOverview = (teamId: number, event?: number) =>
  useGet<TeamOverview>({
    endpoint: '/teams/{teamId}',
    pathParams: { teamId },
    queryParams: event !== undefined ? { event } : undefined,
    queryKey: ['teamOverview', teamId, event],
    staleTime: 60 * 1000,
  });

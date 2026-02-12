import { useGet } from './useFetch';
import type { Team, Event, ElementType, EnrichedFixture, EnrichedPlayer, LiveResponse, ElementSummaryResponse } from '../types/api';

export const useTeams = () =>
  useGet<Array<Team>>({
    endpoint: '/fpl/teams',
    queryKey: ['teams'],
    staleTime: 24 * 60 * 60 * 1000,
  });

export const usePositions = () =>
  useGet<Array<ElementType>>({
    endpoint: '/fpl/positions',
    queryKey: ['positions'],
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useEvents = () =>
  useGet<Array<Event>>({
    endpoint: '/fpl/events',
    queryKey: ['events'],
    staleTime: 60 * 60 * 1000,
  });

export const usePlayers = () =>
  useGet<Array<EnrichedPlayer>>({
    endpoint: '/fpl/players',
    queryKey: ['players'],
    staleTime: 5 * 60 * 1000,
  });

export const useFixtures = () =>
  useGet<Array<EnrichedFixture>>({
    endpoint: '/fpl/fixtures',
    queryKey: ['fixtures'],
    staleTime: 5 * 60 * 1000,
  });

export const useGwFixtures = (gw: number) =>
  useGet<Array<EnrichedFixture>>({
    endpoint: '/fpl/fixtures',
    queryParams: { event: gw },
    queryKey: ['fixtures', gw],
    staleTime: 5 * 60 * 1000,
  });

export const useEventLive = (gw: number) =>
  useGet<LiveResponse>({
    endpoint: '/fpl/live/{event}',
    pathParams: { event: gw },
    queryKey: ['live', gw],
    staleTime: 5 * 60 * 1000,
  });

export const useElementSummary = (elementId: number | null) =>
  useGet<ElementSummaryResponse>({
    endpoint: '/fpl/element-summary/{id}',
    pathParams: { id: elementId ?? undefined },
    queryKey: ['element-summary', elementId],
    staleTime: 5 * 60 * 1000,
    enabled: elementId !== null,
  });

export function useCurrentEvent() {
  const { data: events } = useEvents();
  return events?.find((e) => e.is_current) || null;
}

export function useNextEvent() {
  const { data: events } = useEvents();
  return events?.find((e) => e.is_next) || null;
}

import { useGet } from './useFetch';
import type { TransferRecommendation, LineupRecommendation, ChipRecommendation } from '../types/api';

export const useTransferRecs = (teamId: number) =>
  useGet<Array<TransferRecommendation>>({
    endpoint: '/recommendations/transfers/{id}',
    pathParams: { id: teamId },
    queryKey: ['transferRecs', teamId],
    staleTime: 5 * 60 * 1000,
  });

export const useLineupRecs = (teamId: number) =>
  useGet<LineupRecommendation>({
    endpoint: '/recommendations/lineup/{id}',
    pathParams: { id: teamId },
    queryKey: ['lineupRecs', teamId],
    staleTime: 5 * 60 * 1000,
  });

export const useChipRecs = (teamId: number) =>
  useGet<ChipRecommendation>({
    endpoint: '/recommendations/chip/{id}',
    pathParams: { id: teamId },
    queryKey: ['chipRecs', teamId],
    staleTime: 5 * 60 * 1000,
  });

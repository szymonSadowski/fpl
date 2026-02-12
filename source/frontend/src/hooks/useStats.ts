import { useGet } from './useFetch';
import type { Standing, TrendsResponse } from '../types/api';

export const useStandings = () =>
  useGet<Array<Standing>>({
    endpoint: '/stats/standings',
    queryKey: ['standings'],
    staleTime: 60 * 60 * 1000,
  });

export const useTrends = () =>
  useGet<TrendsResponse>({
    endpoint: '/stats/trends',
    queryKey: ['trends'],
    staleTime: 5 * 60 * 1000,
  });

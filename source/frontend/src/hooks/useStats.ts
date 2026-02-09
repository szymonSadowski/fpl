import { useGet } from './useFetch';
import type { Standing } from '../types/api';

export const useStandings = () =>
  useGet<Array<Standing>>({
    endpoint: '/stats/standings',
    queryKey: ['standings'],
    staleTime: 60 * 60 * 1000,
  });

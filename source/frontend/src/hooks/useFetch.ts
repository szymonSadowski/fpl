import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '../lib/api';
import type { AxiosError } from 'axios';

type PathParams = Record<string, string | number | undefined>;
type QueryParams = Record<string, string | number | boolean | undefined>;

type UseGetOptions<T> = {
  endpoint: string;
  pathParams?: PathParams;
  queryParams?: QueryParams;
  queryKey?: Array<unknown>;
  staleTime?: number;
  enabled?: boolean;
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>;
};

type UseMutateOptions<TData, TVariables> = {
  endpoint: string;
  pathParams?: PathParams;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  options?: UseMutationOptions<TData, AxiosError, TVariables>;
};

function buildUrl(endpoint: string, pathParams?: PathParams, queryParams?: QueryParams): string {
  let url = endpoint;

  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }

  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  return url;
}

function buildQueryKey(endpoint: string, pathParams?: PathParams, queryParams?: QueryParams): Array<unknown> {
  return [endpoint, pathParams, queryParams].filter(Boolean);
}

export function useGet<T>({
  endpoint,
  pathParams,
  queryParams,
  queryKey,
  staleTime = 5 * 60 * 1000,
  enabled = true,
  options,
}: UseGetOptions<T>) {
  const url = buildUrl(endpoint, pathParams, queryParams);
  const key = queryKey ?? buildQueryKey(endpoint, pathParams, queryParams);

  const autoEnabled = pathParams
    ? Object.values(pathParams).every((v) => v !== undefined && v !== null)
    : true;

  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    staleTime,
    enabled: enabled && autoEnabled,
    ...options,
  });
}

export function useMutate<TData = unknown, TVariables = unknown>({
  endpoint,
  pathParams,
  method = 'POST',
  options,
}: UseMutateOptions<TData, TVariables>) {
  const url = buildUrl(endpoint, pathParams);

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await api.request<TData>({
        url,
        method,
        data: variables,
      });
      return data;
    },
    ...options,
  });
}

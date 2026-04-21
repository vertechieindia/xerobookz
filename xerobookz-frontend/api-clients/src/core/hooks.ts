import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "./client";
import { APIResponse } from "../types";

export function useApiQuery<TData = any, TError = any>(
  queryKey: (string | boolean | undefined)[],
  url: string,
  options?: Omit<UseQueryOptions<APIResponse<TData>, TError>, "queryKey" | "queryFn">
) {
  return useQuery<APIResponse<TData>, TError>({
    queryKey: queryKey.filter((k): k is string => k !== undefined && typeof k === "string"),
    queryFn: () => apiClient.get<TData>(url),
    ...options,
  });
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Overload 1: Function-based mutation (legacy pattern)
export function useApiMutation<TData = any, TVariables = any, TError = any>(
  mutationFn: (variables: TVariables) => Promise<APIResponse<TData>>,
  options?: UseMutationOptions<APIResponse<TData>, TError, TVariables>
): ReturnType<typeof useMutation<APIResponse<TData>, TError, TVariables>>;

// Overload 2: URL-based mutation (new pattern)
export function useApiMutation<TData = any, TVariables = any, TError = any>(
  url: string,
  method?: HttpMethod,
  options?: UseMutationOptions<APIResponse<TData>, TError, TVariables>
): ReturnType<typeof useMutation<APIResponse<TData>, TError, TVariables>>;

// Implementation
export function useApiMutation<TData = any, TVariables = any, TError = any>(
  urlOrFn: string | ((variables: TVariables) => Promise<APIResponse<TData>>),
  methodOrOptions?: HttpMethod | UseMutationOptions<APIResponse<TData>, TError, TVariables>,
  maybeOptions?: UseMutationOptions<APIResponse<TData>, TError, TVariables>
) {
  let mutationFn: (variables: TVariables) => Promise<APIResponse<TData>>;
  let options: UseMutationOptions<APIResponse<TData>, TError, TVariables> | undefined;

  if (typeof urlOrFn === "function") {
    // Function-based pattern
    mutationFn = urlOrFn;
    options = methodOrOptions as UseMutationOptions<APIResponse<TData>, TError, TVariables> | undefined;
  } else {
    // URL-based pattern
    const url = urlOrFn;
    const method = (typeof methodOrOptions === "string" ? methodOrOptions : "POST") as HttpMethod;
    options = maybeOptions;

    mutationFn = async (variables: TVariables): Promise<APIResponse<TData>> => {
      switch (method) {
        case "GET":
          return apiClient.get<TData>(url);
        case "POST":
          return apiClient.post<TData>(url, variables);
        case "PUT":
          return apiClient.put<TData>(url, variables);
        case "PATCH":
          return apiClient.patch<TData>(url, variables);
        case "DELETE":
          return apiClient.delete<TData>(url);
        default:
          return apiClient.post<TData>(url, variables);
      }
    };
  }

  return useMutation<APIResponse<TData>, TError, TVariables>({
    mutationFn,
    ...options,
  });
}


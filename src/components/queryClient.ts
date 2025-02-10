import { QueryClient, MutationCache, QueryCache } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
const throwOnError = (error: any) => {
  const httpErr = error?.response?.status;
  if (httpErr && httpErr >= 400 && httpErr < 500) return false;
  return true;
};

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (err, _variables, _context, mutation) => {
      Sentry.withScope((scope) => {
        scope.setContext("mutation", {
          mutationId: mutation.mutationId,
          variables: mutation.state.variables,
        });
        if (mutation.options.mutationKey) {
          scope.setFingerprint(
            Array.from(mutation.options.mutationKey) as string[]
          );
        }
        Sentry.captureException(err);
      });
    },
  }),
  queryCache: new QueryCache({
    onError: (err, query) => {
      Sentry.withScope((scope) => {
        scope.setContext("query", { queryHash: query.queryHash });
        scope.setFingerprint([query.queryHash.replaceAll(/[0-9]/g, "0")]);
        Sentry.captureException(err);
      });
    },
  }),
  defaultOptions: {
    mutations: {
      retry: 0,
      throwOnError,
    },
    queries: {
      retry: 0,
      throwOnError,
      // garbage cached data collection time
      gcTime: 5000,
      staleTime: 0,
    },
  },
});

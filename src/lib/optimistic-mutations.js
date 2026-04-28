/**
 * Standardized optimistic mutation patterns for TanStack Query
 */

import { useQueryClient } from "@tanstack/react-query";

/**
 * Creates a standardized optimistic update mutation config for entities
 * @param {Object} config - Configuration object
 * @param {Array} config.queryKey - Query key to invalidate
 * @param {Function} config.mutationFn - Async mutation function
 * @param {Function} config.getId - Function to extract ID from item (default: item => item.id)
 * @param {Function} config.onSuccess - Optional success callback
 * @param {Function} config.onError - Optional error callback
 * @returns {Object} TanStack Query mutation config
 */
export function createOptimisticMutation({
  queryKey,
  mutationFn,
  getId = (item) => item.id,
  onSuccess,
  onError
}) {
  return {
    mutationFn,
    onMutate: async (variables) => {
      const queryClient = useQueryClient();
      
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);
      
      // Optimistically update
      if (variables.id) {
        // Update operation
        queryClient.setQueryData(queryKey, (old) =>
          old?.map(item => getId(item) === variables.id ? { ...item, ...variables.data } : item)
        );
      } else if (variables.delete) {
        // Delete operation
        queryClient.setQueryData(queryKey, (old) =>
          old?.filter(item => getId(item) !== variables.delete)
        );
      } else {
        // Create operation
        queryClient.setQueryData(queryKey, (old) => [...(old || []), variables]);
      }
      
      return { previousData, queryClient };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData && context?.queryClient) {
        context.queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(err, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after mutation
      if (context?.queryClient) {
        context.queryClient.invalidateQueries({ queryKey });
      }
    },
    onSuccess
  };
}

/**
 * Hook-based helper for applying optimistic mutations within components
 * Ensures queryClient is correctly accessed from React context
 */
export function useOptimisticUpdate({ queryKey, getId = (item) => item.id }) {
  const queryClient = useQueryClient();

  return {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      
      if (variables.id) {
        queryClient.setQueryData(queryKey, (old) =>
          old?.map(item => getId(item) === variables.id ? { ...item, ...variables.data } : item)
        );
      } else if (variables.delete) {
        queryClient.setQueryData(queryKey, (old) =>
          old?.filter(item => getId(item) !== variables.delete)
        );
      } else {
        queryClient.setQueryData(queryKey, (old) => [...(old || []), { ...variables, id: Date.now().toString() }]);
      }
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  };
}
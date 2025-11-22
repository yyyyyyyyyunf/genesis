import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageConfig } from '@genesis/hercules/types';
import { fetchPageConfig, savePageConfig } from '../api/page-config';

export const PAGE_CONFIG_QUERY_KEY = ['page-config'];

export const usePageConfig = () => {
  return useQuery({
    queryKey: PAGE_CONFIG_QUERY_KEY,
    queryFn: fetchPageConfig,
  });
};

export const useSavePageConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: savePageConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGE_CONFIG_QUERY_KEY });
    },
  });
};


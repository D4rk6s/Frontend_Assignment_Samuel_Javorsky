import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type SheltersResponse, type DonationStats, type DonationRequest, type DonationResponse } from '@/lib/api';

export const useShelters = (search?: string) => {
  return useQuery<SheltersResponse>({
    queryKey: ['shelters', search],
    queryFn: () => api.getShelters(search),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStats = (search?: string) => {
  return useQuery<DonationStats>({
    queryKey: ['stats', search],
    queryFn: () => api.getStats(search),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

export const useSubmitDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DonationResponse, Error, DonationRequest>({
    mutationFn: api.submitDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

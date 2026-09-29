import { useQuery } from '@tanstack/react-query';
import { HttpMerchantRepository } from '@/infrastructure/repositories/HttpMerchantRepository';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';

const merchantRepo = new HttpMerchantRepository();

export function useMerchantBalance(id?: string) {
  const { activeMerchantId } = useActiveMerchant();
  const targetId = id || activeMerchantId;

  const query = useQuery({
    queryKey: ['merchantProfile', targetId],
    queryFn: () => merchantRepo.getProfile(targetId),
    enabled: !!targetId,
    refetchInterval: 15000,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

import { useQuery } from '@tanstack/react-query';
import { HttpSettlementRepository } from '@/infrastructure/repositories/HttpSettlementRepository';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';

const settlementRepo = new HttpSettlementRepository();

export function useSettlements(merchantId?: string) {
  const { activeMerchantId } = useActiveMerchant();
  const targetId = merchantId || activeMerchantId;

  return useQuery({
    queryKey: ['settlements', targetId],
    queryFn: () => settlementRepo.getSettlementsByMerchant(targetId),
    enabled: !!targetId,
    refetchInterval: 15000,
  });
}

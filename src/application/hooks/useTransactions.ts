import { useQuery } from '@tanstack/react-query';
import { HttpTransactionRepository } from '@/infrastructure/repositories/HttpTransactionRepository';
import { TransactionFilters } from '@/domain/entities/transaction';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';

const txRepo = new HttpTransactionRepository();

export function useTransactions(filters: TransactionFilters = {}, merchantId?: string) {
  const { activeMerchantId } = useActiveMerchant();
  const targetMerchantId = merchantId || activeMerchantId;

  return useQuery({
    queryKey: ['transactions', targetMerchantId, filters],
    queryFn: () => txRepo.getTransactionsByMerchant(targetMerchantId, filters),
    placeholderData: (previousData) => previousData,
    refetchInterval: 15000,
  });
}

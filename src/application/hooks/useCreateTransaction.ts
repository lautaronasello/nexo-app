import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpTransactionRepository } from '@/infrastructure/repositories/HttpTransactionRepository';
import { CreateTransactionDTO } from '@/domain/entities/transaction';

const txRepo = new HttpTransactionRepository();

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTransactionDTO) => txRepo.createTransaction(dto),
    onSuccess: () => {
      // Invalidate queries so that balance cards, transactions list and settlements update
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['merchantProfile'] });
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
}

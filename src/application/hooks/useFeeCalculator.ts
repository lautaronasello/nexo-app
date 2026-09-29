import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentMethod } from '@/domain/entities/transaction';
import { HttpSettlementRepository } from '@/infrastructure/repositories/HttpSettlementRepository';
import { CalculateSettlementFeeUseCase } from '../use-cases/CalculateSettlementFeeUseCase';

const settlementRepo = new HttpSettlementRepository();
const fallbackCalculator = new CalculateSettlementFeeUseCase();

export function useFeeCalculator(
  initialAmount: number = 10000,
  initialMethod: PaymentMethod = 'DEBIT',
  initialImmediatePenalty: boolean = false,
) {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialMethod);
  const [immediateWithPenalty, setImmediateWithPenalty] = useState<boolean>(initialImmediatePenalty);

  const { data: preview, isLoading } = useQuery({
    queryKey: ['settlementPreview', amount, paymentMethod, immediateWithPenalty],
    queryFn: () =>
      settlementRepo.calculatePreview({
        amountGross: amount,
        paymentMethod,
        immediateWithPenalty: paymentMethod === 'CREDIT_3' ? immediateWithPenalty : false,
      }),
    enabled: amount > 0,
    staleTime: 60 * 1000,
  });

  const fallbackResult = fallbackCalculator.execute({
    grossAmount: amount,
    paymentMethod,
    immediateWithPenalty: paymentMethod === 'CREDIT_3' ? immediateWithPenalty : false,
  });

  return {
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    immediateWithPenalty,
    setImmediateWithPenalty,
    result: preview || fallbackResult,
    isLoading,
  };
}

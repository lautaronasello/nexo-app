import { PaymentMethod } from './transaction';

export type SettlementStatus = 'PENDING' | 'COMPLETED';

export interface Settlement {
  id: string;
  transactionId: string;
  merchantId: string;
  amountNet: number;
  feeApplied: number;
  taxApplied: number;
  scheduledPayoutDate: string;
  status: SettlementStatus;
  createdAt: string;
}

export interface CalculateSettlementDTO {
  amountGross: number;
  paymentMethod: PaymentMethod;
  immediateWithPenalty?: boolean;
}

export interface SettlementCalculationPreview {
  amountGross: number;
  amountNet: number;
  feeApplied: number;
  taxApplied: number;
  feePercentage: number;
  taxRate: number;
  scheduledPayoutDate: string;
  payoutDelayHoursOrDays: string;
}

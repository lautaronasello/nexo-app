import { PaymentMethod } from './transaction';
import { SettlementCalculationPreview } from './settlement';

export interface FeeCalculationRequest {
  grossAmount: number;
  paymentMethod: PaymentMethod;
  immediateWithPenalty?: boolean;
}

export type FeeCalculationResult = SettlementCalculationPreview;

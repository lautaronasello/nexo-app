import { Settlement } from './settlement';

export type PaymentMethod = 'DEBIT' | 'CREDIT_1' | 'CREDIT_3' | 'QR';

export type TransactionStatus = 'PENDING' | 'SETTLED' | 'FAILED';

export interface Transaction {
  id: string;
  merchantId: string;
  amountGross: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  settlement?: Settlement | null;
}

export interface CreateTransactionDTO {
  merchantId: string;
  amountGross: number;
  paymentMethod: PaymentMethod;
  idempotencyKey: string;
  immediateWithPenalty?: boolean;
}

export interface TransactionCreatedResponse {
  message: string;
  transaction: Transaction;
  settlement: Settlement;
  breakdown: {
    feePercentage: number;
    taxRate: number;
    payoutDelay: string;
    scheduledPayoutDate: string;
    queueDelayMs: number;
  };
}

export interface TransactionFilters {
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

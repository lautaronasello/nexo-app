import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import {
  Transaction,
  CreateTransactionDTO,
  TransactionCreatedResponse,
  TransactionFilters,
  PaginatedTransactions,
} from '@/domain/entities/transaction';
import { apiClient } from '../api/axios-client';

export class HttpTransactionRepository implements ITransactionRepository {
  async getTransactionsByMerchant(
    merchantId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;

    if (!merchantId) {
      return { data: [], total: 0, page, limit, totalPages: 1 };
    }

    let txList: Transaction[] = [];

    try {
      const response = await apiClient.get<any[]>(
        `/transactions/merchant/${merchantId}`,
      );
      if (Array.isArray(response.data)) {
        txList = response.data.map(this.normalizeTransaction);
      }
    } catch {
      return { data: [], total: 0, page, limit, totalPages: 1 };
    }

    // Apply local client-side filters (status, paymentMethod, search)
    let filtered = [...txList];

    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters?.paymentMethod) {
      filtered = filtered.filter(
        (t) => t.paymentMethod === filters.paymentMethod,
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.idempotencyKey?.toLowerCase().includes(query) ||
          t.paymentMethod.toLowerCase().includes(query),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await apiClient.get<any>(`/transactions/${id}`);
    return this.normalizeTransaction(response.data);
  }

  async createTransaction(
    dto: CreateTransactionDTO,
  ): Promise<TransactionCreatedResponse> {
    const payload = {
      merchantId: dto.merchantId,
      amountGross: Number(dto.amountGross),
      paymentMethod: dto.paymentMethod,
      idempotencyKey:
        dto.idempotencyKey ||
        `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...(dto.immediateWithPenalty !== undefined
        ? { immediateWithPenalty: dto.immediateWithPenalty }
        : {}),
    };

    const response = await apiClient.post<any>('/transactions', payload);
    const res = response.data;

    const normalizedTx = this.normalizeTransaction(res.transaction);
    const normalizedSettlement = {
      id: res.settlement.id,
      transactionId: res.settlement.transactionId,
      merchantId: res.settlement.merchantId,
      amountNet: Number(res.settlement.amountNet),
      feeApplied: Number(res.settlement.feeApplied),
      taxApplied: Number(res.settlement.taxApplied),
      scheduledPayoutDate:
        typeof res.settlement.scheduledPayoutDate === 'string'
          ? res.settlement.scheduledPayoutDate
          : new Date(res.settlement.scheduledPayoutDate).toISOString(),
      status: res.settlement.status,
      createdAt: res.settlement.createdAt || new Date().toISOString(),
    };

    normalizedTx.settlement = normalizedSettlement;

    return {
      message: res.message || 'Transaction created',
      transaction: normalizedTx,
      settlement: normalizedSettlement,
      breakdown: res.breakdown || {},
    };
  }

  private normalizeTransaction(data: any): Transaction {
    const rawSettlement = data.settlement;
    const settlement = rawSettlement
      ? {
          id: rawSettlement.id,
          transactionId: rawSettlement.transactionId,
          merchantId: rawSettlement.merchantId,
          amountNet: Number(rawSettlement.amountNet),
          feeApplied: Number(rawSettlement.feeApplied),
          taxApplied: Number(rawSettlement.taxApplied),
          scheduledPayoutDate:
            typeof rawSettlement.scheduledPayoutDate === 'string'
              ? rawSettlement.scheduledPayoutDate
              : new Date(rawSettlement.scheduledPayoutDate).toISOString(),
          status: rawSettlement.status,
          createdAt: rawSettlement.createdAt || new Date().toISOString(),
        }
      : undefined;

    return {
      id: data.id,
      merchantId: data.merchantId,
      amountGross: Number(data.amountGross ?? data.amount ?? 0),
      paymentMethod: data.paymentMethod,
      status: data.status,
      idempotencyKey: data.idempotencyKey || '',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      settlement,
    };
  }
}

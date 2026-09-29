import {
  Transaction,
  CreateTransactionDTO,
  TransactionCreatedResponse,
  TransactionFilters,
  PaginatedTransactions,
} from '../entities/transaction';

export interface ITransactionRepository {
  getTransactionsByMerchant(
    merchantId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions>;
  getTransactionById(id: string): Promise<Transaction>;
  createTransaction(dto: CreateTransactionDTO): Promise<TransactionCreatedResponse>;
}

'use client';

import React, { useState } from 'react';
import { TransactionFilters as ITransactionFilters } from '@/domain/entities/transaction';
import { useTransactions } from '@/application/hooks/useTransactions';
import { TransactionFilters } from '@/presentation/components/transactions/TransactionFilters';
import { TransactionTable } from '@/presentation/components/transactions/TransactionTable';
import { ArrowLeftRight } from 'lucide-react';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<ITransactionFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useTransactions(filters);

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-300'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-black text-foreground tracking-tight flex items-center gap-2'>
            <ArrowLeftRight className='w-6 h-6 text-primary' /> Historial de
            Transacciones
          </h1>
          <p className='text-xs text-muted mt-1'>
            Consulta detallada, filtrado y estado de acreditaciones de todos tus
            cobros.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionTable
        data={data}
        isLoading={isLoading}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}

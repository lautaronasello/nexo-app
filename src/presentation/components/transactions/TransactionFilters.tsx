'use client';

import React from 'react';
import { TransactionFilters as ITransactionFilters, TransactionStatus, PaymentMethod } from '@/domain/entities/transaction';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '../ui/Input';

interface TransactionFiltersProps {
  filters: ITransactionFilters;
  onChange: (newFilters: ITransactionFilters) => void;
  onReset: () => void;
}

export function TransactionFilters({ filters, onChange, onReset }: TransactionFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por ID de transacción o clave de idempotencia..."
            icon={<Search className="w-4 h-4" />}
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value, page: 1 })}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                status: (e.target.value as TransactionStatus) || undefined,
                page: 1,
              })
            }
            className="w-full md:w-44 bg-card border border-border text-foreground text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="SETTLED">Liquidados</option>
            <option value="FAILED">Fallidos</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                paymentMethod: (e.target.value as PaymentMethod) || undefined,
                page: 1,
              })
            }
            className="w-full md:w-44 bg-card border border-border text-foreground text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Medios de Pago</option>
            <option value="DEBIT">Tarjeta Débito</option>
            <option value="CREDIT_1">Crédito 1 Pago</option>
            <option value="CREDIT_3">Crédito 3 Cuotas</option>
            <option value="QR">QR Nexo</option>
          </select>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-black/5 transition-colors shrink-0"
            title="Limpiar filtros"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

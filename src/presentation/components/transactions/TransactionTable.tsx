'use client';

import React from 'react';
import { PaginatedTransactions, PaymentMethod } from '@/domain/entities/transaction';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, CreditCard, QrCode, Clock, CheckCircle } from 'lucide-react';

interface TransactionTableProps {
  data?: PaginatedTransactions;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function TransactionTable({ data, isLoading, onPageChange }: TransactionTableProps) {
  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentLabels: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
    DEBIT: { label: 'Débito', icon: <CreditCard className="w-3.5 h-3.5 text-secondary" /> },
    CREDIT_1: { label: 'Crédito (1)', icon: <CreditCard className="w-3.5 h-3.5 text-primary" /> },
    CREDIT_3: { label: 'Crédito (3)', icon: <CreditCard className="w-3.5 h-3.5 text-accent-orange" /> },
    QR: { label: 'QR Nexo', icon: <QrCode className="w-3.5 h-3.5 text-accent-green" /> },
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const transactions = data?.data || [];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-background/80 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3.5">ID Transacción / Fecha</th>
              <th className="px-5 py-3.5">Clave de Idempotencia</th>
              <th className="px-5 py-3.5">Medio de Pago</th>
              <th className="px-5 py-3.5">Estado Tx</th>
              <th className="px-5 py-3.5">Acreditación Programada</th>
              <th className="px-5 py-3.5 text-right">Monto Bruto</th>
              <th className="px-5 py-3.5 text-right">Comisión + IVA</th>
              <th className="px-5 py-3.5 text-right">Neto Acreditable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-normal">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-muted">
                  No se encontraron transacciones registradas para este comercio.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const totalDeductions =
                  tx.settlement
                    ? tx.settlement.feeApplied + tx.settlement.taxApplied
                    : 0;

                const netAmount =
                  tx.settlement?.amountNet ??
                    (tx.amountGross ? tx.amountGross - totalDeductions : 0);

                return (
                  <tr key={tx.id} className="hover:bg-black/2 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-mono text-foreground font-semibold">
                        {tx.id.startsWith('tx_') ? tx.id : `TX-${tx.id.slice(0, 8)}`}
                      </div>
                      <div className="text-[11px] text-muted">{formatDate(tx.createdAt)}</div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-muted bg-background px-2 py-1 rounded border border-border">
                        {tx.idempotencyKey || 'N/A'}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-medium">
                        {paymentLabels[tx.paymentMethod]?.icon || <CreditCard className="w-3.5 h-3.5" />}
                        <span>{paymentLabels[tx.paymentMethod]?.label || tx.paymentMethod}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <TransactionStatusBadge status={tx.status} />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {tx.settlement ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] text-foreground">
                            <Clock className="w-3 h-3 text-primary" />
                            {formatDate(tx.settlement.scheduledPayoutDate)}
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              tx.settlement.status === 'COMPLETED'
                                ? 'bg-accent-green/10 text-accent-green'
                                : 'bg-accent-orange/10 text-accent-orange'
                            }`}
                          >
                            Liquidación: {tx.settlement.status === 'COMPLETED' ? 'Acreditada' : 'Pendiente'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted text-[11px]">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap font-medium text-foreground">
                      {formatCurrency(tx.amountGross)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap text-accent-red font-medium">
                      - {formatCurrency(totalDeductions)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap font-extrabold text-accent-green">
                      {formatCurrency(netAmount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="px-5 py-4 bg-background/50 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted">
            Mostrando página <strong className="text-foreground">{data.page}</strong> de{' '}
            <strong className="text-foreground">{data.totalPages}</strong> ({data.total} operaciones)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => onPageChange(data.page - 1)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => onPageChange(data.page + 1)}
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

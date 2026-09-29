'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { useTransactions } from '@/application/hooks/useTransactions';
import { TransactionStatusBadge } from '../transactions/TransactionStatusBadge';
import { ArrowRight, History, CreditCard, QrCode } from 'lucide-react';
import { PaymentMethod } from '@/domain/entities/transaction';

export function RecentTransactionsCard() {
  const { data, isLoading } = useTransactions({ limit: 5 });

  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const paymentLabels: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
    DEBIT: { label: 'Débito', icon: <CreditCard className="w-3.5 h-3.5 text-secondary" /> },
    CREDIT_1: { label: 'Crédito (1)', icon: <CreditCard className="w-3.5 h-3.5 text-primary" /> },
    CREDIT_3: { label: 'Crédito (3)', icon: <CreditCard className="w-3.5 h-3.5 text-accent-orange" /> },
    QR: { label: 'QR Nexo', icon: <QrCode className="w-3.5 h-3.5 text-accent-green" /> },
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const transactions = data?.data || [];

  return (
    <Card className="shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">Transacciones Recientes</h3>
            <p className="text-xs text-muted">Últimos cobros registrados por la API de transacciones</p>
          </div>
        </div>

        <Link
          href="/transactions"
          className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline"
        >
          Ver Historial Completo <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 pt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted">
          No hay transacciones registradas para este comercio.
        </div>
      ) : (
        <div className="divide-y divide-border pt-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                  {paymentLabels[tx.paymentMethod]?.icon || <CreditCard className="w-3.5 h-3.5 text-muted" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-mono text-foreground truncate">
                      {tx.id.startsWith('tx_') ? tx.id : `TX-${tx.id.slice(0, 8)}`}
                    </span>
                    <TransactionStatusBadge status={tx.status} />
                  </div>
                  <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                    <span>{paymentLabels[tx.paymentMethod]?.label || tx.paymentMethod}</span>
                    <span className="text-border">•</span>
                    <span>{formatDate(tx.createdAt)}</span>
                    {tx.idempotencyKey && (
                      <>
                        <span className="text-border">•</span>
                        <span className="text-muted font-mono text-[10px] truncate">
                          {tx.idempotencyKey}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-foreground">
                  {formatCurrency(tx.amountGross)}
                </div>
                <div className="text-[11px] text-accent-green font-medium">
                  Neto:{' '}
                  {formatCurrency(
                    tx.settlement?.amountNet ??
                      (tx.amountGross ? tx.amountGross * 0.98 : 0)
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

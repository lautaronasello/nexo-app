'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { useMerchantBalance } from '@/application/hooks/useMerchantBalance';
import { useTransactions } from '@/application/hooks/useTransactions';
import { Wallet, Clock, TrendingUp, CheckCircle, ArrowUpRight } from 'lucide-react';

export function BalanceCards() {
  const { profile, isLoading: isProfileLoading } = useMerchantBalance();
  const { data: txData, isLoading: isTxLoading } = useTransactions({ limit: 100 });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(val);
  };

  if (isProfileLoading || isTxLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  // Calculate total processed today from actual transactions
  const todayStr = new Date().toISOString().split('T')[0];
  const transactions = txData?.data || [];
  const processedToday = transactions
    .filter((tx) => tx.createdAt.startsWith(todayStr))
    .reduce((sum, tx) => sum + (tx.amountGross || 0), 0);

  const availableBalance = profile?.availableBalance ?? 0;
  const pendingBalance = profile?.pendingBalance ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Saldo Disponible */}
      <Card hoverEffect className="relative overflow-hidden group border-accent-green/20 bg-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-accent-green uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4" /> Saldo Disponible
          </span>
          <span className="text-[10px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full border border-accent-green/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Acreditado en Cuenta
          </span>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {formatCurrency(availableBalance)}
          </div>
          <p className="text-xs text-muted mt-1 flex items-center gap-1">
            Disponible para transferencias o retiros
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted">Total Liquidaciones</span>
          <span className="font-mono text-accent-green font-medium flex items-center gap-0.5">
            {profile?._count?.settlements ?? 0} liquidaciones
          </span>
        </div>
      </Card>

      {/* Saldo Pendiente */}
      <Card hoverEffect className="relative overflow-hidden group border-accent-orange/20 bg-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-accent-orange uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Saldo Pendiente
          </span>
          <span className="text-[10px] bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full border border-accent-orange/20">
            En Cola de Liquidación
          </span>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {formatCurrency(pendingBalance)}
          </div>
          <p className="text-xs text-muted mt-1">
            Fondos programados para acreditación bancaria (BullMQ)
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted">Total Transacciones</span>
          <span className="text-accent-orange font-medium">
            {profile?._count?.transactions ?? transactions.length} operaciones
          </span>
        </div>
      </Card>

      {/* Total Procesado Hoy */}
      <Card hoverEffect className="relative overflow-hidden group border-primary/20 bg-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Total Procesado Hoy
          </span>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            Bruto de la Jornada
          </span>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {formatCurrency(processedToday)}
          </div>
          <p className="text-xs text-muted mt-1">
            Volumen acumulado en ventas hoy
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted">Operaciones Hoy</span>
          <span className="text-primary font-medium">
            {transactions.filter((tx) => tx.createdAt.startsWith(todayStr)).length} cobros registrados
          </span>
        </div>
      </Card>
    </div>
  );
}

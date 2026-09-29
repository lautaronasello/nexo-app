'use client';

import React from 'react';
import { useSettlements } from '@/application/hooks/useSettlements';
import { Card } from '@/presentation/components/ui/Card';
import { Skeleton } from '@/presentation/components/ui/Skeleton';
import { CreditCard, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function SettlementsPage() {
  const { data: settlements = [], isLoading, isError } = useSettlements();

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalNet = settlements.reduce((sum, s) => sum + (s.amountNet || 0), 0);
  const totalFees = settlements.reduce((sum, s) => sum + (s.feeApplied || 0) + (s.taxApplied || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary" /> Liquidaciones & Acreditaciones
        </h1>
        <p className="text-xs text-muted mt-1">
          Auditoría de liquidaciones programadas, comisiones retenidas e impuestos según la API de NEXO.
        </p>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Total Liquidaciones
          </span>
          <div className="text-2xl font-black text-foreground mt-2">{settlements.length}</div>
          <span className="text-[11px] text-muted">Registradas en el motor</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Neto Total Liquidado
          </span>
          <div className="text-2xl font-black text-accent-green mt-2">{formatCurrency(totalNet)}</div>
          <span className="text-[11px] text-muted">Monto final acreditado/a acreditar</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Total Comisiones + IVA
          </span>
          <div className="text-2xl font-black text-accent-red mt-2">{formatCurrency(totalFees)}</div>
          <span className="text-[11px] text-muted">Deducciones aplicadas por el sistema</span>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-background/80 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3.5">ID Liquidación / Creada</th>
                <th className="px-5 py-3.5">ID Transacción</th>
                <th className="px-5 py-3.5">Fecha Pago Programada</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Comisión Aplicada</th>
                <th className="px-5 py-3.5 text-right">IVA (21%)</th>
                <th className="px-5 py-3.5 text-right">Monto Neto Acreditado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-normal">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <Skeleton className="h-8 w-full max-w-lg mx-auto" />
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    No hay liquidaciones registradas para el comercio seleccionado.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-black/2 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-mono text-foreground font-semibold">
                        {s.id.startsWith('set_') ? s.id : `SET-${s.id.slice(0, 8)}`}
                      </div>
                      <div className="text-[11px] text-muted">{formatDate(s.createdAt)}</div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-muted bg-background px-2 py-1 rounded border border-border">
                        {s.transactionId.startsWith('tx_') ? s.transactionId : `TX-${s.transactionId.slice(0, 8)}`}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(s.scheduledPayoutDate)}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {s.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent-green/10 text-accent-green border border-accent-green/20">
                          <CheckCircle2 className="w-3 h-3" /> Liquidado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                          <Clock className="w-3 h-3" /> En Proceso
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap text-accent-red font-medium">
                      - {formatCurrency(s.feeApplied)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap text-accent-red font-medium">
                      - {formatCurrency(s.taxApplied)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap font-extrabold text-accent-green">
                      {formatCurrency(s.amountNet)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

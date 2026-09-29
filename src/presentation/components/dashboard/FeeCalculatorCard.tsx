'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useFeeCalculator } from '@/application/hooks/useFeeCalculator';
import { PaymentMethod } from '@/domain/entities/transaction';
import {
  Calculator,
  Calendar,
  Percent,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export function FeeCalculatorCard() {
  const {
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    immediateWithPenalty,
    setImmediateWithPenalty,
    result,
    isLoading,
  } = useFeeCalculator(15000, 'DEBIT', false);

  const paymentOptions: { id: PaymentMethod; label: string; detail: string }[] =
    [
      { id: 'DEBIT', label: 'Tarjeta Débito', detail: '0.8% • 24hs' },
      { id: 'CREDIT_1', label: 'Crédito 1 Pago', detail: '1.8% • 48hs' },
      {
        id: 'CREDIT_3',
        label: 'Crédito 3 Cuotas',
        detail: '6.5% • 10 Días Hábiles',
      },
      { id: 'QR', label: 'Cobro por QR', detail: '0.6% • Inmediato (0hs)' },
    ];

  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Inmediato';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className='shadow-xs relative overflow-hidden'>
      {/* Background Accent glow */}
      <div className='absolute -top-24 -right-24 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none' />

      <div className='flex items-center justify-between pb-4 border-b border-border'>
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary'>
            <Calculator className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-foreground'>
              Simulador de Liquidación
            </h2>
            <p className='text-xs text-muted'>
              Calculá tus comisiones e impuestos en tiempo real
            </p>
          </div>
        </div>
        <span className='text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full flex items-center gap-1'>
          <Zap className='w-3 h-3' /> Tarifas Vigentes NEXO
        </span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5'>
        {/* Left Inputs */}
        <div className='lg:col-span-6 space-y-4'>
          <div>
            <Input
              label='Monto Bruto a Cobrar ($ ARS)'
              type='number'
              prefixSymbol='$'
              min={1}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder='Ej: 15000'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-foreground mb-2'>
              Medio de Pago Seleccionado
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type='button'
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3 rounded-xl text-left border transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground shadow-xs shadow-primary/10'
                        : 'bg-card border-border hover:border-secondary/40 text-muted hover:text-foreground'
                    }`}
                  >
                    <div className='text-xs font-semibold'>{opt.label}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isSelected
                          ? 'text-primary font-medium'
                          : 'text-muted'
                      }`}
                    >
                      {opt.detail}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Option for CREDIT_3 payout speed */}
          {paymentMethod === 'CREDIT_3' && (
            <div className='p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2'>
              <label className='flex items-center justify-between cursor-pointer'>
                <div>
                  <span className='text-xs font-semibold text-foreground block'>
                    Acreditación Inmediata con Penalidad (+2%)
                  </span>
                  <span className='text-[11px] text-muted'>
                    Acredita en el momento (0hs) abonando 8.5% en lugar de
                    esperar 10 días hábiles.
                  </span>
                </div>
                <input
                  type='checkbox'
                  checked={immediateWithPenalty}
                  onChange={(e) => setImmediateWithPenalty(e.target.checked)}
                  className='w-4 h-4 rounded text-primary bg-card border-border focus:ring-primary cursor-pointer'
                />
              </label>
              {immediateWithPenalty && (
                <div className='flex items-center gap-1.5 text-[11px] text-accent-orange'>
                  <AlertTriangle className='w-3.5 h-3.5 shrink-0' />
                  <span>
                    Se aplicará 8.5% de comisión (6.5% base + 2% recargo por
                    inmediatez).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Output Breakdown */}
        <div className='lg:col-span-6 bg-background/80 border border-border rounded-xl p-5 flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5'>
                <Percent className='w-3.5 h-3.5 text-primary' /> Desglose
                Oficial del Backend
              </h3>
              {isLoading && (
                <span className='text-[10px] text-primary animate-pulse'>
                  Calculando...
                </span>
              )}
            </div>

            <div className='space-y-2.5 text-xs'>
              <div className='flex justify-between items-center text-foreground'>
                <span>Monto Bruto Original:</span>
                <span className='font-semibold text-foreground'>
                  {formatCurrency(result.amountGross)}
                </span>
              </div>

              <div className='flex justify-between items-center text-muted'>
                <span>
                  Comisión NEXO ({(result.feePercentage * 100).toFixed(1)}%):
                </span>
                <span className='text-accent-red font-medium'>
                  - {formatCurrency(result.feeApplied)}
                </span>
              </div>

              <div className='flex justify-between items-center text-muted'>
                <span>IVA sobre Comisión (21%):</span>
                <span className='text-accent-red font-medium'>
                  - {formatCurrency(result.taxApplied)}
                </span>
              </div>

              <div className='flex justify-between items-center pt-2 border-t border-border text-muted'>
                <span>Total Retenciones:</span>
                <span className='text-accent-red font-semibold'>
                  - {formatCurrency(result.feeApplied + result.taxApplied)}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-5 pt-4 border-t border-border space-y-3'>
            <div className='flex items-baseline justify-between'>
              <span className='text-xs font-semibold text-muted'>
                Neto a Liquidar:
              </span>
              <span className='text-2xl font-black text-accent-green tracking-tight'>
                {formatCurrency(result.amountNet)}
              </span>
            </div>

            <div className='flex items-center gap-2 text-xs text-foreground bg-card px-3 py-2 rounded-lg border border-border'>
              <Calendar className='w-4 h-4 text-primary shrink-0' />
              <span>
                Acreditación:{' '}
                <strong className='text-accent-green font-medium'>
                  {result.payoutDelayHoursOrDays || 'Inmediato'}
                </strong>{' '}
                <span className='text-muted'>
                  ({formatDate(result.scheduledPayoutDate)})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreateTransaction } from '@/application/hooks/useCreateTransaction';
import { useFeeCalculator } from '@/application/hooks/useFeeCalculator';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';
import { PaymentMethod } from '@/domain/entities/transaction';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

const createTxSchema = z.object({
  amountGross: z
    .number({ message: 'Ingresá un monto válido' })
    .min(10, 'El monto mínimo de cobro es $10 ARS')
    .max(10000000, 'Monto máximo excedido'),
  paymentMethod: z.enum(['DEBIT', 'CREDIT_1', 'CREDIT_3', 'QR'] as const),
  immediateWithPenalty: z.boolean().optional(),
});

type CreateTxFormValues = z.infer<typeof createTxSchema>;

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTransactionModal({
  isOpen,
  onClose,
}: CreateTransactionModalProps) {
  const { activeMerchantId, activeMerchant } = useActiveMerchant();
  const [createdResult, setCreatedResult] = useState<any | null>(null);
  const createTxMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTxFormValues>({
    resolver: zodResolver(createTxSchema),
    defaultValues: {
      amountGross: 12000,
      paymentMethod: 'DEBIT',
      immediateWithPenalty: false,
    },
  });

  const watchAmount = watch('amountGross') || 0;
  const watchMethod = watch('paymentMethod') || 'DEBIT';
  const watchImmediate = watch('immediateWithPenalty') || false;

  const { result } = useFeeCalculator(
    watchAmount,
    watchMethod as PaymentMethod,
    watchImmediate,
  );

  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const onSubmit = (data: CreateTxFormValues) => {
    setCreatedResult(null);

    const idempotencyKey = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    createTxMutation.mutate(
      {
        merchantId: activeMerchantId,
        amountGross: data.amountGross,
        paymentMethod: data.paymentMethod,
        idempotencyKey,
        immediateWithPenalty:
          data.paymentMethod === 'CREDIT_3'
            ? !!data.immediateWithPenalty
            : undefined,
      },
      {
        onSuccess: (res) => {
          setCreatedResult(res);
          reset();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCreatedResult(null);
        onClose();
      }}
      title='Cobro POS / QR Nexo'
      subtitle={`Registrar transacción en ${activeMerchant?.businessName || 'comercio'} vía API`}
    >
      {createdResult ? (
        <div className='py-6 text-center space-y-4'>
          <div className='w-14 h-14 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mx-auto border border-accent-green/30 animate-in zoom-in-75 duration-300'>
            <CheckCircle2 className='w-8 h-8' />
          </div>
          <h4 className='text-base font-bold text-foreground'>
            Cobro Aprobado y Liquidación Encolada
          </h4>
          <p className='text-xs text-muted max-w-sm mx-auto'>
            La transacción fue procesada exitosamente en el backend y asignada a
            la cola de BullMQ.
          </p>

          <div className='bg-background border border-border rounded-xl p-4 text-xs text-left space-y-2 max-w-md mx-auto'>
            <div className='flex justify-between items-center text-muted'>
              <span>ID Transacción:</span>
              <span className='font-mono text-accent-green font-semibold'>
                {createdResult.transaction.id}
              </span>
            </div>
            <div className='flex justify-between items-center text-muted'>
              <span>Monto Bruto:</span>
              <span className='font-bold text-foreground'>
                {formatCurrency(createdResult.transaction.amountGross)}
              </span>
            </div>
            <div className='flex justify-between items-center text-muted'>
              <span>Monto Neto Acreditable:</span>
              <span className='font-extrabold text-accent-green'>
                {formatCurrency(createdResult.settlement.amountNet)}
              </span>
            </div>
            <div className='flex justify-between items-center text-muted'>
              <span>Comisión + Impuesto:</span>
              <span className='text-accent-red font-medium'>
                -{' '}
                {formatCurrency(
                  createdResult.settlement.feeApplied +
                    createdResult.settlement.taxApplied,
                )}
              </span>
            </div>
            <div className='flex justify-between items-center text-muted pt-2 border-t border-border'>
              <span>Plazo de Acreditación:</span>
              <span className='text-primary font-medium'>
                {createdResult.breakdown?.payoutDelay || 'Programada'}
              </span>
            </div>
          </div>

          <div className='pt-2'>
            <Button
              variant='primary'
              onClick={() => {
                setCreatedResult(null);
                onClose();
              }}
            >
              Entendido
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='Monto Bruto A Cobrar ($ ARS)'
            type='number'
            prefixSymbol='$'
            error={errors.amountGross?.message}
            {...register('amountGross', { valueAsNumber: true })}
          />

          <div>
            <label className='block text-xs font-medium text-foreground mb-1.5'>
              Medio de Pago (Soportado por API)
            </label>
            <select
              className='w-full bg-card border border-border rounded-xl text-foreground text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary/40'
              {...register('paymentMethod')}
            >
              <option value='DEBIT'>Tarjeta Débito (0.8% • 24hs)</option>
              <option value='CREDIT_1'>Crédito 1 Pago (1.8% • 48hs)</option>
              <option value='CREDIT_3'>
                Crédito 3 Cuotas (6.5% • 10 Días Hábiles)
              </option>
              <option value='QR'>Cobro por QR (0.6% • Inmediato)</option>
            </select>
          </div>

          {watchMethod === 'CREDIT_3' && (
            <div className='p-3 bg-primary/5 border border-primary/20 rounded-xl'>
              <label className='flex items-center gap-2.5 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded text-primary bg-card border-border focus:ring-primary'
                  {...register('immediateWithPenalty')}
                />
                <div>
                  <span className='text-xs font-semibold text-foreground block'>
                    Acreditación Inmediata (+2% penalidad = 8.5% total)
                  </span>
                  <span className='text-[11px] text-muted'>
                    Acreditar al instante sin esperar los 10 días hábiles
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Quick Net Payout Preview from Backend */}
          <div className='bg-background border border-border rounded-xl p-3.5 text-xs flex items-center justify-between'>
            <div className='space-y-0.5'>
              <span className='text-muted block'>
                Neto estimado a acreditar:
              </span>
              <span className='text-muted/80 text-[11px]'>
                Retención aplicada: -
                {formatCurrency(result.feeApplied + result.taxApplied)}
              </span>
            </div>
            <div className='text-right'>
              <span className='text-base font-extrabold text-accent-green block'>
                {formatCurrency(result.amountNet)}
              </span>
              <span className='text-[10px] text-muted'>
                Plazo: {result.payoutDelayHoursOrDays || 'Inmediato'}
              </span>
            </div>
          </div>

          {createTxMutation.isError && (
            <div className='p-3 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs rounded-xl flex items-center gap-2'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>
                {(createTxMutation.error as any)?.response?.data?.message ||
                  'Error al procesar el cobro en el backend.'}
              </span>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-2'>
            <Button variant='ghost' type='button' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant='primary'
              type='submit'
              isLoading={createTxMutation.isPending}
              icon={<CreditCard className='w-4 h-4' />}
            >
              Procesar Cobro API
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

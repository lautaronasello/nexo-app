'use client';

import React, { useState } from 'react';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';
import { useMerchantBalance } from '@/application/hooks/useMerchantBalance';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import {
  CreditCard,
  Store,
  Plus,
  ChevronDown,
  AlertCircle,
  Building2,
} from 'lucide-react';

interface HeaderProps {
  onOpenSimulateModal: () => void;
}

export function Header({ onOpenSimulateModal }: HeaderProps) {
  const {
    merchants,
    activeMerchant,
    activeMerchantId,
    setActiveMerchantId,
    createMerchant,
    isCreateModalOpen,
    setIsCreateModalOpen,
  } = useActiveMerchant();
  const { profile } = useMerchantBalance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form states for new merchant
  const [businessName, setBusinessName] = useState('');
  const [cuit, setCuit] = useState('');
  const [email, setEmail] = useState('');

  const current = profile || activeMerchant;

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setIsSubmitting(true);
    try {
      await createMerchant({ businessName, cuit, email });
      setBusinessName('');
      setCuit('');
      setEmail('');
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setCreateError(
        err.response?.data?.message || 'Error al registrar el comercio',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className='sticky top-0 z-30 w-full bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* Merchant Details & Selector */}
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0'>
            <Store className='w-5 h-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-base font-bold text-foreground leading-tight'>
                {current?.businessName ||
                  (merchants.length > 0
                    ? 'Sin comercio seleccionado'
                    : 'No hay comercios registrados')}
              </h1>
              {current ? (
                <span className='text-[10px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full border border-accent-green/20 font-medium'>
                  Conectado a API
                </span>
              ) : (
                <span className='text-[10px] bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full border border-accent-orange/20 font-medium'>
                  {merchants.length > 0 ? 'Sin selección' : 'Sin datos'}
                </span>
              )}
            </div>
            <p className='text-xs text-muted flex items-center gap-2 mt-0.5'>
              {current ? (
                <>
                  <span>CUIT: {current.cuit || 'Sin CUIT'}</span>
                  <span className='text-border'>•</span>
                  <span>{current.email || 'Sin email'}</span>
                </>
              ) : (
                <span>
                  {merchants.length > 0
                    ? 'Seleccioná un comercio del menú para ver su información'
                    : 'Creá un nuevo comercio para comenzar a operar'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions & Merchant Switching */}
        <div className='flex items-center gap-3'>
          {/* Merchant Dropdown */}
          {merchants.length > 0 && (
            <div className='relative inline-flex items-center'>
              <select
                value={activeMerchantId || ''}
                onChange={(e) => setActiveMerchantId(e.target.value)}
                className='appearance-none bg-card border border-border text-xs font-medium text-foreground rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer'
              >
                {!activeMerchantId && (
                  <option value=''>-- Seleccionar Comercio --</option>
                )}
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    🏪 {m.businessName}
                  </option>
                ))}
              </select>
              <ChevronDown className='w-3.5 h-3.5 text-muted absolute right-2.5 pointer-events-none' />
            </div>
          )}

          {/* New Merchant Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className='w-3.5 h-3.5' />}
          >
            Nuevo Comercio
          </Button>

          {/* Simulate Action Button */}
          <Button
            variant='primary'
            size='sm'
            onClick={onOpenSimulateModal}
            disabled={!activeMerchantId}
            icon={<CreditCard className='w-4 h-4' />}
          >
            Cobro POS / QR
          </Button>
        </div>
      </header>

      {/* Modal for Creating Merchant via POST /merchants */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title='Registrar Nuevo Comercio'
        subtitle='Agregá un comercio a la API de NEXO para liquidaciones automáticas'
      >
        <form onSubmit={handleCreateMerchant} className='space-y-4'>
          <Input
            label='Razón Social / Nombre Comercial'
            placeholder='Ej: Complejo Pádel Central'
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />

          <Input
            label='CUIT (con o sin guiones)'
            placeholder='30-71628492-4'
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            required
          />

          <Input
            label='Email del Comercio'
            type='email'
            placeholder='finanzas@padelcentral.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {createError && (
            <div className='p-3 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs rounded-xl flex items-center gap-2'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>{createError}</span>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-2'>
            <Button
              variant='ghost'
              type='button'
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant='primary' type='submit' isLoading={isSubmitting}>
              Registrar Comercio
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

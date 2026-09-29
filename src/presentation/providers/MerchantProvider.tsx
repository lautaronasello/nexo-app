'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Merchant, CreateMerchantDTO } from '@/domain/entities/merchant';
import { HttpMerchantRepository } from '@/infrastructure/repositories/HttpMerchantRepository';

interface MerchantContextType {
  merchants: Merchant[];
  activeMerchant: Merchant | null;
  activeMerchantId: string;
  setActiveMerchantId: (id: string) => void;
  createMerchant: (dto: CreateMerchantDTO) => Promise<Merchant>;
  isLoading: boolean;
  refetchMerchants: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const merchantRepo = new HttpMerchantRepository();

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export function MerchantProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [activeMerchantId, setActiveMerchantIdState] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const { data: merchants = [], isLoading, refetch } = useQuery({
    queryKey: ['merchants'],
    queryFn: () => merchantRepo.getMerchants(),
    refetchInterval: 30000,
  });

  useEffect(() => {
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('nexo_active_merchant_id') : null;
    if (savedId && merchants.some((m) => m.id === savedId)) {
      setActiveMerchantIdState(savedId);
    } else if (merchants.length > 0) {
      setActiveMerchantIdState(merchants[0].id);
    } else {
      setActiveMerchantIdState('');
    }
  }, [merchants]);

  const setActiveMerchantId = (id: string) => {
    setActiveMerchantIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexo_active_merchant_id', id);
    }
    queryClient.invalidateQueries({ queryKey: ['merchantProfile', id] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['settlements'] });
  };

  const createMerchantMutation = useMutation({
    mutationFn: (dto: CreateMerchantDTO) => merchantRepo.createMerchant(dto),
    onSuccess: (newMerchant) => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      setActiveMerchantId(newMerchant.id);
    },
  });

  const activeMerchant =
    merchants.find((m) => m.id === activeMerchantId) ||
    (merchants.length > 0 ? merchants[0] : null);

  return (
    <MerchantContext.Provider
      value={{
        merchants,
        activeMerchant,
        activeMerchantId: activeMerchant?.id || activeMerchantId || '',
        setActiveMerchantId,
        createMerchant: createMerchantMutation.mutateAsync,
        isLoading,
        refetchMerchants: refetch,
        isCreateModalOpen,
        setIsCreateModalOpen,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useActiveMerchant() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useActiveMerchant must be used within a MerchantProvider');
  }
  return context;
}

'use client';

import React from 'react';
import { useActiveMerchant } from '@/presentation/providers/MerchantProvider';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Store, AlertTriangle, Plus } from 'lucide-react';

export function MerchantDashboardStatus() {
  const { merchants, activeMerchant, isLoading, setIsCreateModalOpen } = useActiveMerchant();

  if (isLoading) {
    return null;
  }

  // Case 1: No merchants in the database/list
  if (merchants.length === 0) {
    return (
      <Card className="border-accent-orange/30 bg-accent-orange/5 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-orange/10 border border-accent-orange/20 rounded-2xl text-accent-orange shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                No hay comercios registrados en la base de datos
              </h3>
              <p className="text-xs text-muted mt-1 max-w-xl">
                Actualmente la API no devolvió ningún comercio. Para visualizar métricas de balance, procesar cobros y simular liquidaciones, registrá tu primer comercio.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            Registrar Comercio
          </Button>
        </div>
      </Card>
    );
  }

  // Case 2: Merchants exist, but none is currently selected
  if (!activeMerchant) {
    return (
      <Card className="border-primary/30 bg-primary/5 p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              No hay ningún comercio seleccionado
            </h3>
            <p className="text-xs text-muted mt-1">
              Seleccioná un comercio del menú desplegable de la barra superior para acceder a su resumen de cuenta, historial de cobros y liquidaciones programadas.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

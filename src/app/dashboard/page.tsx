import React from 'react';
import { BalanceCards } from '@/presentation/components/dashboard/BalanceCards';
import { FeeCalculatorCard } from '@/presentation/components/dashboard/FeeCalculatorCard';
import { RecentTransactionsCard } from '@/presentation/components/dashboard/RecentTransactionsCard';
import { MerchantDashboardStatus } from '@/presentation/components/dashboard/MerchantDashboardStatus';

export const metadata = {
  title: 'Dashboard | NEXO Merchant',
  description: 'Resumen de balance, liquidación y simulador de cobro para comercios.',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Panel Principal del Comercio
        </h1>
        <p className="text-xs text-muted mt-1">
          Visualizá tus saldos en tiempo real, simula liquidaciones y monitorea cobros POS/QR.
        </p>
      </div>

      {/* Merchant Status Banner (if zero merchants or no selection) */}
      <section>
        <MerchantDashboardStatus />
      </section>

      {/* Balance Cards Section */}
      <section>
        <BalanceCards />
      </section>

      {/* Cashout Fee Calculator Simulator */}
      <section>
        <FeeCalculatorCard />
      </section>

      {/* Recent Transactions List */}
      <section>
        <RecentTransactionsCard />
      </section>
    </div>
  );
}

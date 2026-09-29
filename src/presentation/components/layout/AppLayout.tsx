'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CreateTransactionModal } from '../dashboard/CreateTransactionModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-(--background) flex flex-col md:flex-row font-sans antialiased text-foreground'>
      <Sidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <Header onOpenSimulateModal={() => setIsModalOpen(true)} />
        <main className='flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8'>
          {children}
        </main>
      </div>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

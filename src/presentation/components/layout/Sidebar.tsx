'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Transacciones',
      href: '/transactions',
      icon: ArrowLeftRight,
    },
    {
      label: 'Liquidaciones',
      href: '/settlements',
      icon: CreditCard,
    },
  ];

  return (
    <aside className='w-full md:w-64 bg-card border-r border-border flex flex-col justify-between shrink-0 text-foreground'>
      <div>
        {/* Brand Header */}
        <div className='p-6 flex items-center gap-3 border-b border-border'>
          <div className='w-9 h-9 rounded-xl overflow-hidden border border-border flex items-center justify-center shrink-0'>
            <Image
              src='/favicon.jpg'
              alt='NEXO Logo'
              width={36}
              height={36}
              className='w-full h-full object-cover'
              priority
            />
          </div>
          <div>
            <span className='text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1'>
              NEXO{' '}
              <span className='text-xs font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20'>
                PAY
              </span>
            </span>
            <span className='block text-[10px] font-medium text-muted uppercase tracking-wider'>
              Merchant Console
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='p-4 space-y-1.5'>
          <div className='px-3 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider'>
            Menú Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs font-semibold'
                      : 'text-muted hover:text-foreground hover:bg-black/5',
                  ),
                )}
              >
                <Icon
                  className={clsx(
                    'w-4 h-4',
                    isActive ? 'text-primary' : 'text-muted',
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info badge */}
      <div className='p-4 border-t border-border'>
        <div className='bg-background/80 border border-border rounded-xl p-3.5 text-xs'>
          <div className='flex items-center gap-2 text-foreground font-medium mb-1'>
            <ShieldCheck className='w-4 h-4 text-accent-green' />
            Liquidación Segura
          </div>
          <p className='text-[11px] text-muted leading-relaxed'>
            BCRA Compliant • Tokenización PCI-DSS v4.0
          </p>
        </div>
      </div>
    </aside>
  );
}

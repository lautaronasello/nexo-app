import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/presentation/providers/QueryProvider';
import { MerchantProvider } from '@/presentation/providers/MerchantProvider';
import { AppLayout } from '@/presentation/components/layout/AppLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NEXO Merchant Dashboard | Plataforma Transaccional para Comercios',
  description:
    'Gestión en tiempo real de transacciones, liquidaciones y simulador de cobros POS/QR para comercios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='es'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full bg-(--background) text-(--foreground) selection:bg-(--background) selection:text-(--primary)'>
        <QueryProvider>
          <MerchantProvider>
            <AppLayout>{children}</AppLayout>
          </MerchantProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

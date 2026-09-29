import { Merchant } from '@/domain/entities/merchant';
import { Transaction } from '@/domain/entities/transaction';
import { Settlement } from '@/domain/entities/settlement';

export const INITIAL_MOCK_MERCHANT: Merchant = {
  id: 'd3b07384-d113-46a6-a719-74d71510d540',
  businessName: 'Club Deportivo Padel Pro & Canchas',
  cuit: '30-71628492-4',
  email: 'contacto@padelpro.com.ar',
  availableBalance: 145890.5,
  pendingBalance: 48200.0,
  createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  _count: {
    transactions: 6,
    settlements: 6,
  },
};

export const INITIAL_MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'set_8819201',
    transactionId: 'tx_8819201',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 14890.92,
    feeApplied: 90.0, // 0.6% QR
    taxApplied: 18.9, // 21% IVA on 90
    scheduledPayoutDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'set_8819202',
    transactionId: 'tx_8819202',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 25791.95,
    feeApplied: 1820.0, // 6.5% CREDIT_3
    taxApplied: 382.2, // 21% IVA on 1820
    scheduledPayoutDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'set_8819203',
    transactionId: 'tx_8819203',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 12379.0,
    feeApplied: 100.0, // 0.8% DEBIT
    taxApplied: 21.0, // 21% IVA on 100
    scheduledPayoutDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'set_8819204',
    transactionId: 'tx_8819204',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 17607.82,
    feeApplied: 324.0, // 1.8% CREDIT_1
    taxApplied: 68.04, // 21% IVA on 324
    scheduledPayoutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 'set_8819205',
    transactionId: 'tx_8819205',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 8912.88,
    feeApplied: 72.0, // 0.8% DEBIT
    taxApplied: 15.12, // 21% IVA on 72
    scheduledPayoutDate: new Date().toISOString(),
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'set_8819206',
    transactionId: 'tx_8819206',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountNet: 15883.65,
    feeApplied: 96.0, // 0.6% QR
    taxApplied: 20.16, // 21% IVA on 96
    scheduledPayoutDate: new Date(Date.now() - 3600000 * 30).toISOString(),
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
  },
];

export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_8819201',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 15000,
    paymentMethod: 'QR',
    status: 'SETTLED',
    idempotencyKey: 'idemp_mock_8819201',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[0],
  },
  {
    id: 'tx_8819202',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 28000,
    paymentMethod: 'CREDIT_3',
    status: 'PENDING',
    idempotencyKey: 'idemp_mock_8819202',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[1],
  },
  {
    id: 'tx_8819203',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 12500,
    paymentMethod: 'DEBIT',
    status: 'SETTLED',
    idempotencyKey: 'idemp_mock_8819203',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[2],
  },
  {
    id: 'tx_8819204',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 18000,
    paymentMethod: 'CREDIT_1',
    status: 'PENDING',
    idempotencyKey: 'idemp_mock_8819204',
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[3],
  },
  {
    id: 'tx_8819205',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 9000,
    paymentMethod: 'DEBIT',
    status: 'FAILED',
    idempotencyKey: 'idemp_mock_8819205',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[4],
  },
  {
    id: 'tx_8819206',
    merchantId: INITIAL_MOCK_MERCHANT.id,
    amountGross: 16000,
    paymentMethod: 'QR',
    status: 'SETTLED',
    idempotencyKey: 'idemp_mock_8819206',
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    settlement: INITIAL_MOCK_SETTLEMENTS[5],
  },
];

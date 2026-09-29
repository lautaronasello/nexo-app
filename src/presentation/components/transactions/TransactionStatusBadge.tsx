import React from 'react';
import { Badge } from '../ui/Badge';
import { TransactionStatus } from '@/domain/entities/transaction';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="w-3 h-3 animate-pulse" />
          <span>PENDIENTE</span>
        </Badge>
      );
    case 'SETTLED':
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>LIQUIDADO</span>
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="error" className="gap-1">
          <XCircle className="w-3 h-3" />
          <span>FALLIDO</span>
        </Badge>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

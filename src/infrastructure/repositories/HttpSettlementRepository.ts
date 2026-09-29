import { ISettlementRepository } from '@/domain/repositories/ISettlementRepository';
import {
  Settlement,
  CalculateSettlementDTO,
  SettlementCalculationPreview,
} from '@/domain/entities/settlement';
import { apiClient } from '../api/axios-client';
import { CalculateSettlementFeeUseCase } from '@/application/use-cases/CalculateSettlementFeeUseCase';

export class HttpSettlementRepository implements ISettlementRepository {
  private fallbackCalculator = new CalculateSettlementFeeUseCase();

  async calculatePreview(
    dto: CalculateSettlementDTO,
  ): Promise<SettlementCalculationPreview> {
    try {
      const response = await apiClient.post<any>(
        '/settlements/calculate-preview',
        {
          amountGross: Number(dto.amountGross),
          paymentMethod: dto.paymentMethod,
          immediateWithPenalty: !!dto.immediateWithPenalty,
        },
      );

      const d = response.data;
      return {
        amountGross: Number(d.amountGross),
        amountNet: Number(d.amountNet),
        feeApplied: Number(d.feeApplied),
        taxApplied: Number(d.taxApplied),
        feePercentage: Number(d.feePercentage),
        taxRate: Number(d.taxRate),
        scheduledPayoutDate:
          typeof d.scheduledPayoutDate === 'string'
            ? d.scheduledPayoutDate
            : new Date(d.scheduledPayoutDate).toISOString(),
        payoutDelayHoursOrDays: d.payoutDelayHoursOrDays || '',
      };
    } catch {
      // Local calculation fallback aligned 100% with backend
      return this.fallbackCalculator.execute({
        grossAmount: dto.amountGross,
        paymentMethod: dto.paymentMethod,
        immediateWithPenalty: dto.immediateWithPenalty,
      });
    }
  }

  async getSettlementsByMerchant(merchantId: string): Promise<Settlement[]> {
    if (!merchantId) return [];
    try {
      const response = await apiClient.get<any[]>(
        `/settlements/merchant/${merchantId}`,
      );
      if (Array.isArray(response.data)) {
        return response.data.map(this.normalizeSettlement);
      }
      return [];
    } catch {
      return [];
    }
  }

  async getSettlementById(id: string): Promise<Settlement> {
    const response = await apiClient.get<any>(`/settlements/${id}`);
    return this.normalizeSettlement(response.data);
  }

  private normalizeSettlement(data: any): Settlement {
    return {
      id: data.id,
      transactionId: data.transactionId,
      merchantId: data.merchantId,
      amountNet: Number(data.amountNet),
      feeApplied: Number(data.feeApplied),
      taxApplied: Number(data.taxApplied),
      scheduledPayoutDate:
        typeof data.scheduledPayoutDate === 'string'
          ? data.scheduledPayoutDate
          : new Date(data.scheduledPayoutDate).toISOString(),
      status: data.status,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  }
}

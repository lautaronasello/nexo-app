import {
  Settlement,
  CalculateSettlementDTO,
  SettlementCalculationPreview,
} from '../entities/settlement';

export interface ISettlementRepository {
  calculatePreview(dto: CalculateSettlementDTO): Promise<SettlementCalculationPreview>;
  getSettlementsByMerchant(merchantId: string): Promise<Settlement[]>;
  getSettlementById(id: string): Promise<Settlement>;
}

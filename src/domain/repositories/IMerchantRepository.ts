import { Merchant, CreateMerchantDTO } from '../entities/merchant';

export interface IMerchantRepository {
  getMerchants(): Promise<Merchant[]>;
  getProfile(id: string): Promise<Merchant | null>;
  createMerchant(dto: CreateMerchantDTO): Promise<Merchant>;
}

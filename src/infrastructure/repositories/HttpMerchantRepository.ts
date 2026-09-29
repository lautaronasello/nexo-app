import { IMerchantRepository } from '@/domain/repositories/IMerchantRepository';
import { Merchant, CreateMerchantDTO } from '@/domain/entities/merchant';
import { apiClient } from '../api/axios-client';

export class HttpMerchantRepository implements IMerchantRepository {
  async getMerchants(): Promise<Merchant[]> {
    try {
      const response = await apiClient.get<any[]>('/merchants');
      if (Array.isArray(response.data)) {
        return response.data.map(this.normalizeMerchant);
      }
    } catch (err) {
      console.error('Error fetching merchants:', err);
    }

    return [];
  }

  async getProfile(id: string): Promise<Merchant | null> {
    if (!id) {
      return null;
    }
    try {
      const response = await apiClient.get<any>(`/merchants/${id}`);
      if (response.data) {
        return this.normalizeMerchant(response.data);
      }
      return null;
    } catch {
      return null;
    }
  }

  async createMerchant(dto: CreateMerchantDTO): Promise<Merchant> {
    const response = await apiClient.post<any>('/merchants', dto);
    return this.normalizeMerchant(response.data);
  }

  private normalizeMerchant(data: any): Merchant {
    return {
      id: data.id,
      businessName: data.businessName || data.name || 'Comercio Nexo',
      cuit: data.cuit || '',
      email: data.email || '',
      availableBalance: Number(
        data.availableBalance ?? data.balance?.available ?? 0,
      ),
      pendingBalance: Number(data.pendingBalance ?? data.balance?.pending ?? 0),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      _count: data._count,
    };
  }
}

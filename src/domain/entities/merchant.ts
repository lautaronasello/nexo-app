export interface Merchant {
  id: string;
  businessName: string;
  cuit: string;
  email: string;
  availableBalance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    transactions: number;
    settlements: number;
  };
}

export interface CreateMerchantDTO {
  businessName: string;
  cuit: string;
  email: string;
}

// Backward-compatible alias for existing imports if needed
export type MerchantProfile = Merchant;

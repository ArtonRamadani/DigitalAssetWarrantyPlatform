export interface DigitalAsset {
  id: number;
  name: string;
  category: string;
  value: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  warrantyQuotes?: Array<{
    id: number;
    quoteAmount: number;
    validUntil: string;
    createdAt: string;
  }>;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateDigitalAssetInput {
  name: string;
  category: string;
  value: string;
  purchaseDate: string;
  userEmail: string;
  userName?: string;
}

export interface WarrantyQuote {
  assetId: number;
  quoteAmount: number;
  providerName: string;
  validUntil: string;
}

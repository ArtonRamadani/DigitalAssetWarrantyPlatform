import { Decimal } from '@prisma/client/runtime/library';

export type DigitalAsset = {
  id: number;
  name: string;
  category: string;
  value: Decimal;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  warrantyQuotes?: {
    id: number;
    quoteAmount: number;
    providerName: string;
    validUntil: Date;
    createdAt: Date;
  }[];
};

export type CreateDigitalAssetInput = {
  name: string;
  category: string;
  value: string;  // String value from frontend
  purchaseDate: string;  // Accept string from frontend, will be parsed to Date
  userEmail: string;
  userName?: string;
};

export type WarrantyQuote = {
  assetId: number;
  quoteAmount: number;
  providerName: string;
  validUntil: Date;
};

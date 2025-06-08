import { PrismaClient } from '@prisma/client';
import { DigitalAsset } from '../types/digitalAsset';
import { CreateDigitalAssetInput, WarrantyQuote } from '../types/digitalAsset';
import { parseMonetaryValue } from '../types/monetary';

const prisma = new PrismaClient();

export class DigitalAssetsService {
  async createAsset(input: CreateDigitalAssetInput): Promise<DigitalAsset> {
    const parsedInput = {
      name: input.name.trim(),
      category: input.category.trim(),
      value: parseFloat(input.value), 
      purchaseDate: new Date(input.purchaseDate)
    };

    if (isNaN(parsedInput.value)) {
      throw new Error('Invalid value: must be a valid number');
    }
    if (isNaN(parsedInput.purchaseDate.getTime())) {
      throw new Error('Invalid purchase date');
    }

    return prisma.digitalAsset.create({
      data: {
        name: parsedInput.name,
        category: parsedInput.category,
        value: parsedInput.value, 
        purchaseDate: parsedInput.purchaseDate,
        user: {
          connectOrCreate: {
            where: { email: input.userEmail },
            create: {
              email: input.userEmail,
              name: input.userName || 'Anonymous'
            }
          }
        }
      }
    });
  }

  async getAssets(): Promise<DigitalAsset[]> {
    const assets = await prisma.digitalAsset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        warrantyQuotes: true,
        user: true
      }
    });

    return assets.map((asset: any) => ({
      ...asset,
      value: asset.value.toString(),
      warrantyQuotes: asset.warrantyQuotes?.map((quote: any) => ({
        ...quote,
        quoteAmount: Number(quote.quoteAmount)
      }))
    }));
  }

  async getAssetById(id: number): Promise<DigitalAsset | null> {
    return prisma.digitalAsset.findUnique({
      where: { id },
    });
  }

  async getWarrantyQuote(assetId: number): Promise<WarrantyQuote> {
    const asset = await this.getAssetById(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    // First check if theres an existing valid quote
    const existingQuote = await prisma.warrantyQuote.findFirst({
      where: {
        assetId,
        validUntil: {
          gte: new Date()
        }
      }
    });

    if (existingQuote) {
      return {
        assetId: existingQuote.assetId,
        quoteAmount: existingQuote.quoteAmount.toNumber(),
        providerName: existingQuote.providerName,
        validUntil: existingQuote.validUntil
      };
    }

    const baseRate = this.getWarrantyRate(asset.category);
    const valueAsNumber = asset.value.toNumber();
    const quoteAmount = valueAsNumber * baseRate;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    // Create new quote in database
    const createdQuote = await prisma.warrantyQuote.create({
      data: {
        quoteAmount,
        providerName: 'Digital Warranty Pro',
        validUntil,
        assetId
      }
    });

    return {
      assetId: createdQuote.assetId,
      quoteAmount: createdQuote.quoteAmount.toNumber(),
      providerName: createdQuote.providerName,
      validUntil: createdQuote.validUntil
    };
  }

  private getWarrantyRate(category: string): number {
    switch (category.toLowerCase()) {
      case 'electronics':
        return 0.02;
      case 'watches':
        return 0.03;
      case 'collectibles':
        return 0.04;
      default:
        return 0.05;
    }
  }
}

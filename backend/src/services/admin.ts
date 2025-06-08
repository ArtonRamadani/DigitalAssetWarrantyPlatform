import { PrismaClient } from '@prisma/client';
import { DigitalAssetsService } from './digitalAssets';

const prisma = new PrismaClient();

export class AdminService {
  private digitalAssetsService: DigitalAssetsService;

  constructor() {
    this.digitalAssetsService = new DigitalAssetsService();
  }

  async getQuotes(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [quotes, total] = await Promise.all([
      prisma.digitalAsset.findMany({
        skip,
        take: limit,
        include: {
          warrantyQuotes: true,
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.digitalAsset.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      quotes: quotes.map((asset: any) => ({
        id: asset.warrantyQuotes[0]?.id,
        assetId: asset.id,
        quoteAmount: asset.warrantyQuotes[0]?.quoteAmount,
        providerName: asset.warrantyQuotes[0]?.providerName,
        validUntil: asset.warrantyQuotes[0]?.validUntil,
        createdAt: asset.warrantyQuotes[0]?.createdAt,
        asset: {
          name: asset.name,
          category: asset.category,
          value: asset.value.toNumber(),
          purchaseDate: asset.purchaseDate,
          user: {
            name: asset.user.name,
            email: asset.user.email,
          },
        },
      })),
      totalPages,
    };
  }
}

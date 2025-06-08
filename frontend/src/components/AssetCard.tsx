import { useState } from 'react';
import { DigitalAsset, WarrantyQuote } from '../../types/digitalAsset';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface AssetCardProps {
  asset: DigitalAsset;
  onGetQuote: (assetId: number) => Promise<WarrantyQuote | null>;
}

export default function AssetCard({ asset, onGetQuote }: AssetCardProps) {
  const [quote, setQuote] = useState<WarrantyQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetQuote = async () => {
    setIsLoading(true);
    try {
      const quote = await onGetQuote(asset.id);
      setQuote(quote);
    } catch (error) {
      console.error('Error getting quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{asset.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{asset.category}</p>
            <p className="mt-2 text-sm text-gray-500">
              Value: ${asset.value.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Purchased: {formatDate(asset.purchaseDate)}
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleGetQuote}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
            >
              {isLoading ? 'Loading...' : 'Get Quote'}
            </button>
          </div>
        </div>
      </div>

      {quote && (
        <div className="bg-green-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Warranty Quote Available
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Quote Amount: ${quote.quoteAmount.toLocaleString()}</p>
                <p>Provider: {quote.providerName}</p>
                <p>Valid Until: {formatDate(quote.validUntil)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

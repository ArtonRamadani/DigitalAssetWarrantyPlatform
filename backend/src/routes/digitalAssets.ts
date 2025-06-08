import express from 'express';
import { DigitalAssetsService } from '../services/digitalAssets';
import { CreateDigitalAssetInput } from '../types/digitalAsset';

const router = express.Router();
const digitalAssetsService = new DigitalAssetsService();

router.post('/assets', async (req, res) => {
  try {
    const input: CreateDigitalAssetInput = req.body;
    const asset = await digitalAssetsService.createAsset(input);
    res.status(201).json(asset);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/assets', async (_req, res) => {
  try {
    const assets = await digitalAssetsService.getAssets();
    res.json(assets);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/assets/:id/quote', async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await digitalAssetsService.getWarrantyQuote(Number(id));
    res.json(quote);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  }
});

export const digitalAssetsRouter = router;

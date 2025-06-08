import express from 'express';
import { AdminService } from '../services/admin';

const router = express.Router();
const adminService = new AdminService();

router.get('/quotes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const quotes = await adminService.getQuotes(Number(page), Number(limit));
    res.json(quotes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export const adminRouter = router;

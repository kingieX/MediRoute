import { Router, Request, Response } from 'express';
import { Zone } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * GET /zones
 * Fetch all available hospital zones (requires auth)
 */
router.get('/', authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']), (_req: Request, res: Response) => {
  try {
    const zones = Object.values(Zone);
    return res.json({ zones });
  } catch (err) {
    console.error('❌ Error fetching zones:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

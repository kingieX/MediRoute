import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * POST /logs
 * Create a new event log (Admin only, usually internal use)
 */
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { userId, action, details } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'action is required' });
    }

    const log = await prisma.eventLog.create({
      data: {
        userId: userId || null,
        action,
        details: details || null,
      },
      select: {
        id: true,
        userId: true,
        action: true,
        details: true,
        createdAt: true,
      },
    });

    return res.status(201).json(log);
  } catch (err) {
    console.error('Error creating log:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /logs
 * List all event logs (Admin only)
 */
router.get('/', authMiddleware(['ADMIN']), async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.eventLog.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        action: true,
        details: true,
        createdAt: true,
      },
    });

    return res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /logs/:id
 * Fetch single event log (Admin only)
 */
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const log = await prisma.eventLog.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        action: true,
        details: true,
        createdAt: true,
      },
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    return res.json(log);
  } catch (err) {
    console.error('Error fetching log:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

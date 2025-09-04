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
 * Retrieve event logs with optional filters
 * Query params:
 *   - userId (filter by user)
 *   - action (filter by action type)
 *   - startDate, endDate (date range)
 *   - page, pageSize (pagination)
 */
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  const { userId, action, startDate, endDate, page = '1', pageSize = '20' } = req.query;

  try {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (startDate && endDate) {
      filters.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const skip = (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10);
    const take = parseInt(pageSize as string, 10);

    const logs = await prisma.eventLog.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    });

    const total = await prisma.eventLog.count({ where: filters });

    return res.json({
      page: parseInt(page as string, 10),
      pageSize: take,
      total,
      logs,
    });
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

import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { logEvent } from '../utils/loggerService';

const router = Router();

/**
 * POST /alerts
 * Create a new alert (Admin/Doctor/Nurse)
 */
router.post(
  '/',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { type, message } = req.body;
      const currentUser = (req as any).user;

      if (!type || !message) {
        return res.status(400).json({ error: 'type and message are required' });
      }

      const alert = await prisma.alert.create({
        data: {
          type,
          message,
          resolved: false, // default
        },
        select: {
          id: true,
          type: true,
          message: true,
          resolved: true,
          createdAt: true,
        },
      });

      // 🔹 Log event
      await logEvent(currentUser.userId, 'ALERT_CREATED', `Alert created: ${type} - ${message}`);

      return res.status(201).json(alert);
    } catch (err) {
      console.error('Error creating alert:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * GET /alerts
 * List all alerts (Admin/Doctor/Nurse)
 */
router.get(
  '/',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (_req: Request, res: Response) => {
    try {
      const alerts = await prisma.alert.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          message: true,
          resolved: true,
          createdAt: true,
        },
      });

      return res.json(alerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * GET /alerts/:id
 * Fetch a single alert by ID (Admin/Doctor/Nurse)
 */
router.get(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const alert = await prisma.alert.findUnique({
        where: { id },
        select: {
          id: true,
          type: true,
          message: true,
          resolved: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      return res.json(alert);
    } catch (err) {
      console.error('Error fetching alert:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * PUT /alerts/:id
 * Update or resolve an alert
 */
router.put(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { type, message, resolved } = req.body;
      const currentUser = (req as any).user;

      const alert = await prisma.alert.findUnique({ where: { id } });
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      // Role-based restrictions
      const userRole = (req as any).user.role;
      if ((userRole === 'DOCTOR' || userRole === 'NURSE') && (type || message)) {
        return res.status(403).json({ error: 'You can only resolve alerts' });
      }

      const updated = await prisma.alert.update({
        where: { id },
        data: {
          ...(type && { type }),
          ...(message && { message }),
          ...(resolved !== undefined && { resolved }),
        },
        select: {
          id: true,
          type: true,
          message: true,
          resolved: true,
          updatedAt: true,
        },
      });

      // 🔹 Log event
      await logEvent(currentUser.userId, 'ALERT_RESOLVED', `Alert ${id} resolved`);

      return res.json(updated);
    } catch (err) {
      console.error('Error updating alert:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * DELETE /alerts/:id
 * Delete an alert (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    const existing = await prisma.alert.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await prisma.alert.delete({ where: { id } });

    // 🔹 Log event
    await logEvent(currentUser.userId, 'ALERT_DELETED', `Deleted alert ${id}`);

    return res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

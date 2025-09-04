import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { logEvent } from '../utils/loggerService';
import { shiftQueue } from '../queues/shiftQueue';
import { logger } from '../utils/logger';
import { getIO } from '../sockets/socket';

const router = Router();

/**
 * POST /shifts/auto-assign
 * Trigger auto-assignment job (Admin only)
 */
router.post('/auto-assign', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { departmentId, date, strategy } = req.body;
    const currentUser = (req as any).user;

    if (!departmentId || !date) {
      return res.status(400).json({ error: 'departmentId and date are required' });
    }

    const job = await shiftQueue.add('autoAssign', {
      departmentId,
      date,
      strategy: strategy || 'round_robin',
    });

    logger.info(`Enqueued auto-assign job ${job.id} for department ${departmentId}`);

    // 🔹 Log event
    await logEvent(
      currentUser.userId,
      'SHIFT_CREATED',
      `Auto assigned shift to new user in department ${departmentId}`,
    );

    return res.json({
      message: 'Auto-assign job queued successfully',
      jobId: job.id,
    });
  } catch (err) {
    logger.error({ err }, '❌ Error enqueuing auto-assign job');
    return res.status(500).json({ error: 'Failed to queue auto-assign job' });
  }
});

/**
 * POST /shifts
 * Create a new shift (Admin only)
 */
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { userId, departmentId, startTime, endTime } = req.body;
    const currentUser = (req as any).user;

    if (!userId || !departmentId || !startTime || !endTime) {
      return res
        .status(400)
        .json({ error: 'userId, departmentId, startTime, and endTime are required' });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'startTime must be before endTime' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return res.status(404).json({ error: 'Department not found' });

    const shift = await prisma.shift.create({
      data: {
        userId,
        departmentId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        user: { select: { id: true, email: true, role: true } },
        department: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    // 🔹 Log event
    await logEvent(
      currentUser.userId,
      'SHIFT_CREATED',
      `Assigned shift to user ${userId} in department ${departmentId}`,
    );

    // 🔥 Emit event for new shift
    getIO().emit('shift:created', shift);

    return res.status(201).json(shift);
  } catch (err) {
    console.error('Error creating shift:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /shifts
 * List all shifts (Admin only)
 */
router.get('/', authMiddleware(['ADMIN']), async (_req: Request, res: Response) => {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: { startTime: 'asc' },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        user: { select: { id: true, email: true, role: true } },
        department: { select: { id: true, name: true } },
      },
    });

    return res.json(shifts);
  } catch (err) {
    console.error('Error fetching shifts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /shifts/:id
 * Fetch single shift details (Admin only)
 */
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shift = await prisma.shift.findUnique({
      where: { id },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        user: { select: { id: true, email: true, role: true } },
        department: { select: { id: true, name: true } },
      },
    });

    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    return res.json(shift);
  } catch (err) {
    console.error('Error fetching shift:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /shifts/:id
 * Update a shift (Admin only)
 */
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, departmentId, startTime, endTime } = req.body;
    const currentUser = (req as any).user;

    const existing = await prisma.shift.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'startTime must be before endTime' });
    }

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    if (departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: departmentId } });
      if (!dept) return res.status(404).json({ error: 'Department not found' });
    }

    const updated = await prisma.shift.update({
      where: { id },
      data: {
        ...(userId && { userId }),
        ...(departmentId && { departmentId }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        user: { select: { id: true, email: true, role: true } },
        department: { select: { id: true, name: true } },
      },
    });

    // 🔹 Log event
    await logEvent(currentUser.userId, 'SHIFT_UPDATED', `Updated shift ${id}`);

    // 🔥 Emit event for shift update
    getIO().emit('shift:updated', updated);

    return res.json(updated);
  } catch (err) {
    console.error('Error updating shift:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /shifts/:id
 * Delete a shift (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    const existing = await prisma.shift.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    const shift = await prisma.shift.delete({ where: { id } });

    // 🔹 Log event
    await logEvent(currentUser.userId, 'SHIFT_DELETED', `Deleted shift ${id}`);

    // 🔥 Emit event for shift deletion
    getIO().emit('shift:deleted', shift);

    return res.json({ message: 'Shift deleted successfully' });
  } catch (err) {
    console.error('Error deleting shift:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

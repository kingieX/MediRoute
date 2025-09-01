import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * POST /departments
 * Create a new department (Admin only)
 */
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ error: 'Name and capacity are required' });
    }

    const existing = await prisma.department.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: 'Department already exists' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        capacity: Number(capacity),
      },
      select: {
        id: true,
        name: true,
        capacity: true,
        createdAt: true,
      },
    });

    return res.status(201).json(department);
  } catch (err) {
    console.error('Error creating department:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /departments
 * List all departments (Admin only)
 */
router.get('/', authMiddleware(['ADMIN']), async (_req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /departments/:id
 * Fetch details of a department (Admin only)
 */
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        capacity: true,
        createdAt: true,
        updatedAt: true,
        patients: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
        },
        shifts: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    return res.json(department);
  } catch (err) {
    console.error('Error fetching department:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /departments/:id
 * Update a department (Admin only)
 */
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (name) {
      const duplicate = await prisma.department.findUnique({ where: { name } });
      if (duplicate && duplicate.id !== id) {
        return res.status(409).json({ error: 'Another department with this name already exists' });
      }
    }

    const updated = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(capacity && { capacity: Number(capacity) }),
      },
      select: {
        id: true,
        name: true,
        capacity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating department:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /departments/:id
 * Delete a department (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await prisma.department.delete({ where: { id } });

    return res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

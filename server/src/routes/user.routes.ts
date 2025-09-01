import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { hashPassword } from '../utils/password';

const router = Router();

/**
 * POST /users
 * Create a new staff user (Admin only)
 */
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password and role are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /users
 * List all users (Admin only)
 */
router.get('/', authMiddleware(['ADMIN']), async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /users/:id
 * Fetch a single user by ID (Admin only)
 */
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /users/:id
 * Update a user (Admin only)
 */
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /users/:id
 * Delete a user (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

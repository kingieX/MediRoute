import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { hashPassword } from '../utils/password';
import { logEvent } from '../utils/loggerService';

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

    // 🔹 Log event
    const currentUser = (req as any).user;
    await logEvent(
      currentUser.userId,
      'USER_REGISTERED',
      `Created user ${user.email} with role ${role}`,
    );

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
 * GET /users/user
 * List all users (Admin only) with pagination, filters & sorting
 * Query params:
 *   - page (default: 1)
 *   - limit (default: 10)
 *   - role (optional: ADMIN, DOCTOR, NURSE)
 *   - search (optional: email contains)
 *   - sortBy (optional: email | role | createdAt | updatedAt)
 *   - order (optional: asc | desc, default: desc)
 */
router.get('/user', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Filters
    const role = req.query.role as 'ADMIN' | 'DOCTOR' | 'NURSE' | undefined;
    const search = req.query.search as string | undefined;

    const where: any = {};
    if (role) where.role = role;
    if (search) where.email = { contains: search, mode: 'insensitive' };

    // Sorting
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';

    // Validate sortBy field
    const validSortFields = ['email', 'role', 'createdAt', 'updatedAt'];
    const orderBy: any = validSortFields.includes(sortBy)
      ? { [sortBy]: order }
      : { createdAt: 'desc' };

    // Query with pagination, filters & sorting
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortBy,
      order,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /users/:id
 * Admin → can fetch any user
 * User  → can only fetch self
 */
router.get(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = (req as any).user;

      // Only admin or self
      if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * PUT /users/:id
 * Admin → can update any user
 * User  → can only update self
 */
router.put(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, password, role } = req.body;
      const currentUser = (req as any).user;

      // Only admin or self
      if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Non-admins cannot change role
      if (currentUser.role !== 'ADMIN' && role) {
        return res.status(403).json({ error: 'Only admin can change roles' });
      }

      let updateData: any = {};
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updated = await prisma.user.update({
        where: { id },
        // data: {
        //   ...(email && { email }),
        //   ...(password && { password }),
        //   ...(role && { role }),
        // },
        data: updateData,
        select: { id: true, email: true, role: true, updatedAt: true },
      });

      // 🔹 Log event
      if (currentUser.role === 'ADMIN') {
        await logEvent(currentUser.userId, 'USER_UPDATED', `Admin updated user ${id}`);
      } else {
        await logEvent(currentUser.userId, 'PROFILE_UPDATED', `User updated own profile`);
      }

      return res.json(updated);
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * DELETE /users/:id
 * Delete a user (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    // 🔹 Log event
    await logEvent(currentUser.userId, 'USER_DELETED', `Deleted user ${id}`);

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

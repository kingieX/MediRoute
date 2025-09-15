import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { comparePasswords, hashPassword } from '../utils/password';
import { logEvent } from '../utils/loggerService';
import { emitEvent } from '../sockets/socket';
import { Zone } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import { Console } from 'console';

const router = Router();

// Setup Multer for image storage
const upload = multer({
  dest: 'public/uploads/', // Temporary destination
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!') as unknown as null, false);
    }
    cb(null, true);
  },
});

/**
 * POST /users
 * Create a new staff user (Admin only)
 */
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { email, password, role, name, specialty, avatarUrl } = req.body;

    if (!email || !password || !role || !name) {
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
        name,
        specialty,
        avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        avatarUrl: true,
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
        name: true,
        role: true,
        specialty: true,
        avatarUrl: true,
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
          name: true,
          role: true,
          specialty: true,
          avatarUrl: true,
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
        select: {
          id: true,
          name: true,
          specialty: true,
          avatarUrl: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          phone: true,
          bio: true,
          address: true,
          currentLocation: true,
          // Include the linked models
          shifts: true,
          logs: true,
          availability: true,
          PatientAssignment: true,
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
      const { email, password, role, name, specialty, avatarUrl, phone, bio, address } = req.body;
      // console.log('Update request body:', req.body);
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
      if (name) updateData.name = name;
      if (specialty) updateData.specialty = specialty;
      if (avatarUrl) updateData.avatarUrl = avatarUrl;
      if (phone) updateData.phone = phone;
      if (bio) updateData.bio = bio;
      if (address) updateData.address = address;
      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updated = await prisma.user.update({
        where: { id },
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
 * POST /users/change-password
 * Requires authentication
 */
router.post(
  '/change-password',
  authMiddleware(), // ✅ ensure logged in
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const currentUser = (req as any).user;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
      }

      const user = await prisma.user.findUnique({ where: { id: currentUser.userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check old password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      logger.info(`User ${user.email} changed their password`);

      return res.json({ message: 'Password updated successfully' });
    } catch (err) {
      logger.error(err, 'Error in change-password:');
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);
/**
 * POST /users/:id/avatar
 * Upload a profile image for a user.
 */
router.post('/:id/avatar', authMiddleware(), upload.single('profileImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Only allow admin or the user themselves to update
    if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
      // Clean up the uploaded file if forbidden
      if (req.file && req.file.path) {
        await fs.unlink(req.file.path);
      }
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const newPath = path.join('uploads', `${Date.now()}-${req.file.originalname}`);
    const fullPath = path.join(process.cwd(), 'public', newPath);

    // Read and move the file
    await fs.rename(req.file.path, fullPath);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      // Clean up the uploaded file if user is not found
      await fs.unlink(fullPath);
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the old profile image if it exists and is not the default
    if (user.avatarUrl && user.avatarUrl.startsWith('/uploads')) {
      const oldPath = path.join(process.cwd(), 'public', user.avatarUrl);
      try {
        await fs.unlink(oldPath);
      } catch (e) {
        console.warn(`Could not delete old file: ${oldPath}`);
      }
    }

    // Update the user's avatar URL in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { avatarUrl: `/${newPath}` }, // Store the relative URL
    });

    res.json({ url: updatedUser.avatarUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    // Clean up any temporary file
    if (req.file) {
      await fs.unlink(req.file.path).catch((e) => console.error('Error cleaning up temp file:', e));
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

/**
 * POST /users/:id/location
 * Update staff location (REST fallback for testing)
 */
router.post(
  '/:id/location',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    // Validate location against Zone enum
    if (!Object.values(Zone).includes(location)) {
      return res.status(400).json({
        error: `Invalid location. Must be one of: ${Object.values(Zone).join(', ')}`,
      });
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { currentLocation: location },
      });

      // Emit WebSocket event too
      emitEvent('staff_location_update', {
        userId: user.id,
        email: user.email,
        role: user.role,
        zone: user.currentLocation,
        updatedAt: user.updatedAt,
      });

      return res.json({ message: 'Location updated', user });
    } catch (err) {
      console.error('❌ Error updating staff location:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;

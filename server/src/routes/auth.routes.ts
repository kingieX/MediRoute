import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { comparePasswords } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Build payload
    const payload = { userId: user.id, role: user.role };

    // Generate tokens
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // (Optional: store refreshToken in DB for invalidation later)

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/refresh
 * Body: { refreshToken }
 */
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Build new payload
    const newPayload = { userId: payload.userId, role: payload.role };

    // Issue new tokens
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    // (Optional: store new refreshToken in DB and invalidate old one)

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

/**
 * GET /auth/me
 * Headers: Authorization: Bearer <accessToken>
 */
router.get('/me', authMiddleware(), async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Me route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

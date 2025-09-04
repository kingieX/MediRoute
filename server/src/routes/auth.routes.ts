import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { comparePasswords } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authMiddleware } from '../middlewares/auth';
import { logEvent } from '../utils/loggerService';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/email';
import { config } from '../config';

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
      await logEvent(user.id, 'LOGIN_FAILED', `Invalid password for ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Build payload
    const payload = { userId: user.id, role: user.role };

    // Generate tokens
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // (Optional: store refreshToken in DB for invalidation later)

    // Log Event
    await logEvent(user.id, 'LOGIN_SUCCESS', `User ${email} logged in`);

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
 * POST /auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: 'If user exists, reset link sent' }); // prevent user enumeration
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: expiry,
      },
    });

    // ✅ Create reset link (frontend handles the reset page)
    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // ✅ Send email
    await sendEmail(
      email,
      'MediRoute Password Reset',
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background-color: #1a73e8; color: #ffffff; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MediRoute</h1>
            </div>
            <div style="padding: 24px;">
              <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 16px; color: #202124;">Password Reset Request</h2>
              <p style="margin-bottom: 16px;">Hello,</p>
              <p style="margin-bottom: 24px;">You requested to reset your password. Click the button below to change it. This link is only valid for 15 minutes.</p>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #1a73e8; border-radius: 4px; text-decoration: none; font-weight: bold; border: 1px solid #1a73e8;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #757575;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
              <div style="border-top: 1px solid #e0e0e0; margin-top: 24px; padding-top: 24px; text-align: center;">
                <p style="font-size: 12px; color: #a0a0a0; margin: 0;">&copy; ${new Date().getFullYear()} MediRoute. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      `,
    );

    logger.info(`Reset token for ${email}: ${resetToken}`);

    return res.json({ message: 'Reset link generated', resetToken }); // remove resetToken in prod
  } catch (err) {
    logger.error(`Error in forgot-password: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password required' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // still valid
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    logger.error(`Error in reset-password: ${String(err)}`);
    return res.status(500).json({ error: 'Internal server error' });
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

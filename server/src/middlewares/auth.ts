import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Middleware factory: pass required roles, e.g. ["ADMIN"]
export function authMiddleware(requiredRoles: string[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);

      // attach user info to request
      req.user = {
        userId: payload.userId,
        role: payload.role,
      };

      // role-based check
      if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

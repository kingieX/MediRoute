import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),

  // allow either a string ("15m", "7d") or number (3600)
  JWT_ACCESS_EXPIRES_IN: z.union([z.string(), z.number()]).default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.union([z.string(), z.number()]).default('7d'),

  REDIS_URL: z.string().url(),

  // Email
  GMAIL_USER: z.string().email(),
  GMAIL_APP_PASSWORD: z.string(),

  FRONTEND_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
